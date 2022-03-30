import { getCookie } from '../game/utils';
import { IInviteData, MessageHandler } from './MessageHandler';

export interface Data {
  type: keyof MessageHandler;
}

export interface SiteSocket extends WebSocket {
  getFriendStatus: (id: number, name: string) => void;
  setupConnection: () => void;
  setupMessageHandlers: () => void;
}

export class MenuSocket extends WebSocket implements SiteSocket {
  constructor(url: string) {
    super(url);
    this.addEventListener('open', () => {
      this.setupConnection();
      this.setupMessageHandlers();
    });
  }

  getFriendStatus = (id: number, name: string): void => {
    this.send(JSON.stringify({ type: 'status', id, name }));
  };

  setupConnection = (): void => {
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

  setupMessageHandlers = (): void => {
    const handler = new MessageHandler();
    this.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (Object.getOwnPropertyNames(handler).includes(data.type)) {
        handler[data.type as keyof MessageHandler](data, this);
      }
    });
  };
}
