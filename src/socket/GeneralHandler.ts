import { ChatGroup } from '../components/ChatGroup';
import { Friends, FriendList } from '../components/FriendList';
import { InviteWindow } from '../menu/gameMenu';
import { MenuSocket, SiteSocket } from './MenuSocket';
import { MessageHandler } from './MessageHandler';

export interface IInviteData {
  type: keyof MessageHandler<MenuSocket>;
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

export interface IFriendsList {
  type: 'friends';
  friends: Friends;
}

export class GeneralHandler extends MessageHandler<MenuSocket> {
  constructor(socket: MenuSocket) {
    super(socket);
  }

  invite = (data: IInviteData) => {
    const menu = document.querySelector('.menu-container') as HTMLElement;
    menu.appendChild(new InviteWindow(data.username, data.id, this.socket));
  };

  chatMessage = (data: INewMessage): void => {
    if (
      !document.getElementById(data.sender) &&
      data.sender !== (localStorage.getItem('username') as string) &&
      data.recipient_id !== 0
    ) {
      const newGroup = new ChatGroup(
        this.socket,
        localStorage.getItem('username') as string,
        data.sender,
        data.sender_id,
        this.socket.chatGroups,
        false,
        true
      );
      this.socket.chatGroups.addChatGroup(data.sender_id, newGroup);
      document.body.append(newGroup);
    }
  };

  friends = (data: IFriendsList): void => {
    localStorage.setItem('friends', JSON.stringify(data.friends));
    const menu = document.querySelector('.menu-container') as HTMLElement;
    menu.appendChild(new FriendList(this.socket, data.friends));
  };
}
