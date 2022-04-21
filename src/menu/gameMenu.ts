import { AxiosResponse } from '../../node_modules/axios/index';
import { getPlayerId } from '../api';
import { capitalise } from '../game/utils';
import { MenuSocket } from '../socket/MenuSocket';
import { getTemplate } from '../templates/invite';
import { ChatGroup } from '../components/ChatGroup';
import { UserSettings } from '../components/UserSettings';
import { Friends } from '../components/FriendList';

export type FriendShip = [number, number, string, string];

export interface Friend {
  id: number;
  name: string;
  online: boolean;
  inGame: boolean;
}

localStorage.removeItem('gameInProgress');

const axios = require('axios').default;

const menu = document.querySelector('.menu-container') as HTMLElement;

export interface ChatGroups {
  [grouo_id: number]: ChatGroup;
}

export class ChatControls {
  chats: ChatGroups = {};

  addChatGroup = (id: number, group: ChatGroup): void => {
    this.chats[id] = group;
  };

  removeChatGroup = (id: number) => {
    delete this.chats[id];
  };

  get numOfGroups() {
    return Object.keys(this.chats).length;
  }
}

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
    document.cookie = 'type=vs';
    localStorage.setItem('opponentId', String(this.userId));
    localStorage.setItem('opponentName', this.player);
    window.location.href = `../../backend/game/draughts.php?opponent=${this.userId}`;
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

const screen = document.querySelector('.screen');

getPlayerId(username as string, true).then(() => {
  axios.get('../auth/socket-url.php').then((res: AxiosResponse) => {
    const chatGroups = new ChatControls();
    const socket = new MenuSocket(res.data as string, chatGroups);
    const allChat = new ChatGroup(
      socket,
      username as string,
      'Chat',
      0,
      chatGroups
    );
    chatGroups.addChatGroup(0, allChat);
    screen?.appendChild(allChat);

    screen?.appendChild(new UserSettings());
    axios
      .get(
        '../friends/getChatHistory.php?recipient_id=' +
          localStorage.getItem('id')
      )
      .then((res: AxiosResponse) => {
        const unreadIds = [] as number[];
        res.data.forEach((data: any[]) => {
          if (data[4] === 0 && !unreadIds.includes(data[0])) {
            unreadIds.push(data[0]);
          }
        });
        unreadIds.forEach((id) => {
          const friends = JSON.parse(
            localStorage.getItem('friends') as string
          ) as Friends;
          const friendName = Object.values(friends).find((friend: Friend) => {
            return id === friend.id;
          });
          if (friendName) {
            document.body.append(
              new ChatGroup(
                socket,
                username as string,
                friendName.name,
                id,
                chatGroups,
                false,
                true
              )
            );
          }
        });
      });
  });
});
