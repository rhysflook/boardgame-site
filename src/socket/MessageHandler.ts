import { InviteWindow } from '../menu/gameMenu';
import { MenuSocket } from './MenuSocket';

export interface IInviteData {
  type: keyof MessageHandler;
  id: number;
  target: number;
  username: string;
}

export class MessageHandler {
  invite = (data: IInviteData, socket: MenuSocket) => {
    const menu = document.querySelector('.menu-container') as HTMLElement;
    menu.appendChild(new InviteWindow(data.username, data.id, socket));
  };
}
