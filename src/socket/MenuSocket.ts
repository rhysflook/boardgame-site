import { getCookie } from '../game/utils';
import { GeneralHandler } from './GeneralHandler';
import { MessageHandler } from './MessageHandler';

export interface Data {
  type: keyof MessageHandler;
}

export interface SiteSocket extends WebSocket {
  getFriendStatus: (id: number, name: string) => void;
  setupConnection: () => void;
}

export class MenuSocket extends WebSocket implements SiteSocket {
  constructor(url: string) {
    super(url);
    this.addEventListener('open', () => {
      this.setupConnection();
      new GeneralHandler(this);
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
}
