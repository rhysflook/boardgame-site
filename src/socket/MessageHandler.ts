import { SiteSocket } from './MenuSocket';

export type Handler = keyof Omit<MessageHandler, 'socket'>;

export abstract class MessageHandler {
  constructor(public socket: SiteSocket) {
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (this.hasProperty(data.type)) {
        this[data.type as Handler](data);
        this.callback();
      }
    });
  }

  callback = (): void => {};

  hasProperty = (type: string): boolean => {
    return Object.getOwnPropertyNames(this).includes(type);
  };
}
