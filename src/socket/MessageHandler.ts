import { InviteWindow } from '../menu/gameMenu';
import { ChatGroup } from '../ui/ChatGroup';
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

export interface INewMessage {
  type: 'chatMessage';
  content: string;
  sender: string;
  sender_id: number;
  recipient_id: number;
}

export class MessageHandler {
  invite = (data: IInviteData, socket: SiteSocket) => {
    const menu = document.querySelector('.menu-container') as HTMLElement;
    menu.appendChild(new InviteWindow(data.username, data.id, socket));
  };

  chatMessage = (data: INewMessage, socket: SiteSocket): void => {
    if (
      !document.getElementById(data.sender) &&
      data.sender !== (localStorage.getItem('username') as string) &&
      data.recipient_id !== 0
    ) {
      const chat = document.getElementById('chat-area-bar');
      chat?.append(
        new ChatGroup(
          socket,
          localStorage.getItem('username') as string,
          data.sender,
          data.sender_id,
          false,
          true
        )
      );
    }
  };
}
