import { AxiosResponse } from '../../node_modules/axios/index';
import { capitalise, getCookie } from '../game/utils';
import { getTemplate } from '../templates/invite';

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
axios
  .get(`../game/getPlayer.php/?user=${player}`)
  .then((res: AxiosResponse) => {
    if (res.data) {
      localStorage.setItem('id', String(res.data.id));
      localStorage.setItem('username', String(player));
    }
  });

axios.get('../socket-url.php').then((res: AxiosResponse) => {
  if (res) {
    const socket = new WebSocket(res.data as string);
    socket.addEventListener('open', () => {
      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'invite') {
          console.log(data);
          menu.appendChild(new InviteWindow(data.username, data.id, socket));
        }
      });
      const userId = getCookie('id');
      if (userId) {
        socket.send(JSON.stringify({ type: 'start', id: Number(userId) }));
      }
    });
  }
});
