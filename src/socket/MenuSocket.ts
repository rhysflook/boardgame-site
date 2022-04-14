import { getCookie } from '../game/utils';
import { GeneralHandler } from './GeneralHandler';
import { MessageHandler } from './MessageHandler';

export interface Data {
  type: keyof MessageHandler<SiteSocket>;
}

export interface SiteSocket extends WebSocket {
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

  setupConnection = (): void => {
    const userId = getCookie('id');
    if (userId) {
      this.send(
        JSON.stringify({
          type: 'start',
          id: Number(userId),
          location: 'menu',
        })
      );
    }
  };
}
