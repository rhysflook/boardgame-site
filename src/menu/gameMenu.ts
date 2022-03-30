import { AxiosResponse } from '../../node_modules/axios/index';
import { capitalise, getCookie } from '../game/utils';
import { getTemplate } from '../templates/invite';
import { FriendList } from '../ui/FriendList';

type FriendShip = [number, number, string, string];

export interface Friend {
  id: number;
  name: string;
  online: boolean;
  inGame: boolean;
}

const axios = require('axios').default;

const menu = document.querySelector('.menu-container') as HTMLElement;

class InviteWindow extends HTMLDivElement {
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
axios
  .get(`../game/getPlayer.php/?user=${username}`)
  .then((res: AxiosResponse) => {
    if (res.data) {
      localStorage.setItem('id', String(res.data.id));
      localStorage.setItem('username', String(username));
    }
    axios
      .get(`../ui/getFriends.php?id=${Number(localStorage.getItem('id'))}`)
      .then((res: AxiosResponse) => {
        const friends = [] as Friend[];
        const userId = Number(localStorage.getItem('id'));
        res.data.forEach((friendship: FriendShip) => {
          friends.push(
            friendship[0] === userId
              ? {
                  id: friendship[1],
                  name: friendship[3],
                  online: false,
                  inGame: false,
                }
              : {
                  id: friendship[0],
                  name: friendship[2],
                  online: false,
                  inGame: false,
                }
          );
        });
        localStorage.setItem('friends', JSON.stringify(friends));

        axios.get('../socket-url.php').then((res: AxiosResponse) => {
          if (res) {
            const socket = new WebSocket(res.data as string);
            socket.addEventListener('open', () => {
              socket.addEventListener('message', (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'invite') {
                  menu.appendChild(
                    new InviteWindow(data.username, data.id, socket)
                  );
                } else if (data.type === 'players') {
                  friends.forEach((friend) => {
                    if (data.players[friend.id]) {
                      friend.online = true;
                      friend.inGame = data.players[friend.id].in_game;
                    }
                  });
                  const container = document.getElementById('screen');
                  if (container) {
                    container.appendChild(new FriendList(friends));
                  }
                }
              });
              const userId = getCookie('id');
              if (userId) {
                socket.send(
                  JSON.stringify({ type: 'start', id: Number(userId) })
                );
              }
            });
          }
        });
      })
      .catch(() => {
        localStorage.setItem('friends', JSON.stringify([]));
        const container = document.getElementById('screen');
        if (container) {
          container.appendChild(new FriendList([]));
        }
      });
  });
