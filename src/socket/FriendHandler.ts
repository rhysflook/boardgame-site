import { FriendList, Friends } from '../components/FriendList';
import { PopupMessage } from '../components/PopupMessage';
import { GamePiece } from '../game/Pieces/Piece';
import { capitalise } from '../game/utils';
import { SiteSocket } from './MenuSocket';
import { MessageHandler } from './MessageHandler';

export interface INewFriend {
  type: 'newFriend';
  id: number;
  name: string;
  online: boolean;
  in_game: boolean;
}

export interface IPlayers {
  type: 'players';
  players: Friends;
}

export interface IAuthStatus {
  type: 'login' | 'logout';
  id: number;
}

export interface IGameStatus {
  type: 'joinGame' | 'leaveGame';
  id: number;
}

export class FriendHandler extends MessageHandler<SiteSocket> {
  constructor(public friendList: FriendList) {
    super(friendList.socket);
  }

  callback = (): void => {
    this.friendList.setContent();
  };

  newFriend = (data: INewFriend): void => {
    const { id, name, online, in_game } = data;
    const savedList = JSON.parse(localStorage.getItem('friends') as string);
    savedList[id].online = online;
    savedList[id].inGame = in_game;
    localStorage.setItem('friends', JSON.stringify(savedList));
    this.friendList.createRow({ id, name, online, inGame: in_game });
  };

  players = (data: IPlayers): void => {
    Object.values(data.players).forEach((player: any) => {
      this.friendList.friends[player.id].inGame = player.in_game;
      this.friendList.friends[player.id].online = true;
    });
  };

  login = (data: IAuthStatus): void => {
    const message = `${capitalise(
      this.friendList.friends[data.id].name
    )} has logged in!`;
    document.getElementById('screen')?.appendChild(new PopupMessage(message));
    this.friendList.friends[data.id].online = true;
    this.friendList.updateFriendRow(data.id, { online: 'Online' });
  };

  logout = (data: IAuthStatus): void => {
    this.friendList.friends[data.id].online = false;
    this.friendList.updateFriendRow(data.id, { online: 'Offline' });
    const savedList = JSON.parse(localStorage.getItem('friends') as string);
    savedList[data.id].online = false;
    localStorage.setItem('friends', JSON.stringify(savedList));
  };

  joinGame = (data: IGameStatus): void => {
    this.friendList.friends[data.id].inGame = true;
    this.friendList.updateFriendRow(data.id, { inGame: 'Playing' });
  };

  leaveGame = (data: IGameStatus): void => {
    this.friendList.friends[data.id].inGame = false;
    this.friendList.updateFriendRow(data.id, { inGame: '' });
  };
}
