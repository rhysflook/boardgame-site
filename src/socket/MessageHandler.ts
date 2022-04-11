import { SiteSocket } from './MenuSocket';

export type Handler = keyof Omit<MessageHandler<SiteSocket>, 'socket'>;

export abstract class MessageHandler<T extends SiteSocket> {
  constructor(public socket: T) {
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
