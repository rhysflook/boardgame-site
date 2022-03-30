import { InviteWindow } from '../menu/gameMenu';
import { SiteSocket } from './MenuSocket';

export interface IInviteData {
  type: keyof MessageHandler;
  id: number;
  target: number;
  username: string;
}

export interface INewFriend {
  type: 'newFriend';
  id: number;
  name: string;
  online: boolean;
  in_game: boolean;
}

export class MessageHandler {
  invite = (data: IInviteData, socket: SiteSocket) => {
    const menu = document.querySelector('.menu-container') as HTMLElement;
    menu.appendChild(new InviteWindow(data.username, data.id, socket));
  };
}
