import { AxiosResponse } from '../../node_modules/axios/index';
import { getFriendList, getPlayerId } from '../api';
import { capitalise, getCookie } from '../game/utils';
import { MenuSocket } from '../socket/MenuSocket';
import { getTemplate } from '../templates/invite';
import { ChatArea } from '../ui/ChatArea';
import { ChatGroup } from '../ui/ChatGroup';
import { FriendList } from '../ui/FriendList';

export type FriendShip = [number, number, string, string];

export interface Friend {
  id: number;
  name: string;
  online: boolean;
  inGame: boolean;
}

const axios = require('axios').default;

const menu = document.querySelector('.menu-container') as HTMLElement;

export class InviteWindow extends HTMLDivElement {
  constructor(
    public player: string,
    public userId: number,
    public socket: WebSocket
  ) {
    super();

    this.classList.add('popup');

    let shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(getTemplate('invitation'));

    const message = shadowRoot.getElementById('message');
    if (message) {
      message.innerText = `${capitalise(this.player)} wants to play!`;
    }

    const accept = shadowRoot.getElementById('accept');
    if (accept) {
      accept.addEventListener('click', this.acceptInvite);
    }

    const reject = shadowRoot.getElementById('reject');
    if (reject) {
      reject.addEventListener('click', this.rejectInvite);
    }
  }

  acceptInvite = (): void => {
    localStorage.setItem('opponentId', String(this.userId));
    localStorage.setItem('opponentName', this.player);
    window.location.href = `../../src/game/draughts.php?opponent=${this.userId}`;
  };

  rejectInvite = (): void => {
    this.socket.send(JSON.stringify({ type: 'end' }));
    this.remove();
  };

  connectedCallback(): void {
    setTimeout(() => this.rejectInvite(), 30000);
  }
}

customElements.define('x-invite-window', InviteWindow, { extends: 'div' });

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const player = urlParams.get('user');
const username = player === null ? localStorage.getItem('username') : player;

getPlayerId(username as string, true).then(() => {
  axios.get('../socket-url.php').then((res: AxiosResponse) => {
    const socket = new MenuSocket(res.data as string);
    menu.append(new FriendList(socket));
    const chatBar = document.getElementById('chat-area-bar');
    chatBar?.append(new ChatGroup(socket, username as string, 'All', 0));
    axios
      .get(
        '../ui/getChatHistory.php?recipient_id=' + localStorage.getItem('id')
      )
      .then((res: AxiosResponse) => {
        const unreadIds = [] as number[];
        res.data.forEach((data: any[]) => {
          if (data[4] === 0 && !unreadIds.includes(data[0])) {
            unreadIds.push(data[0]);
          }
        });
        unreadIds.forEach((id) => {
          const friends = localStorage.getItem('friends') as string;
          console.log(friends);
          const friendName = JSON.parse(friends).find(
            (friend: Friend) => id === friend.id
          );
          console.log(friendName);
          if (friendName) {
            chatBar?.append(
              new ChatGroup(
                socket,
                username as string,
                friendName.name,
                id,
                false,
                true
              )
            );
          }
        });
      });
  });
});
