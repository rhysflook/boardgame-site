import { getCookie } from '../game/utils';
import { IInviteData, MessageHandler } from './MessageHandler';

export interface Data {
  type: keyof MessageHandler;
}

export class MenuSocket extends WebSocket {
  constructor(url: string) {
    super(url);
    this.addEventListener('open', () => {
      this.setupConnection();
      this.setupMessageHandlers();
    });
  }

  setupConnection = () => {
    const userId = getCookie('id');
    if (userId) {
      this.send(
        JSON.stringify({
          type: 'start',
          id: Number(userId),
        })
      );
    }
  };

  setupMessageHandlers = () => {
    const handler = new MessageHandler();
    this.addEventListener('message', (event) => {
      const data: Data = JSON.parse(event.data);
      if (Object.getOwnPropertyNames(handler).includes(data.type)) {
        handler[data.type](data as IInviteData, this);
      }
    });
  };
}
