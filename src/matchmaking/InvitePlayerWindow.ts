import { AxiosError, AxiosResponse } from '../../node_modules/axios/index';
import { GameSocket } from '../socket/GameSocket';
import { getTemplate } from '../templates/invite';
import { PopupMessage } from '../ui/PopupMessage';

const axios = require('axios').default;

export class InvitePlayerWindow extends HTMLElement {
  timer: NodeJS.Timeout | null = null;
  constructor(public socket: GameSocket, public parent: HTMLElement) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(getTemplate('invitePlayer'));
  }

  connectedCallback(): void {
    this.inviteHandling();
  }

  inviteHandling = (): void => {
    const opponentInput = this.shadowRoot?.getElementById(
      'playerName'
    ) as HTMLInputElement;
    const inviteButton = this.shadowRoot?.getElementById('inviteButton');
    if (inviteButton) {
      inviteButton.addEventListener('click', () => {
        axios
          .get(`getPlayer.php/?user=${opponentInput?.value}`)
          .then((res: AxiosResponse) => {
            console.log(res);
            if (res.data) {
              this.socket.send(
                JSON.stringify({
                  type: 'invite',
                  target: res.data.id,
                  id: Number(localStorage.getItem('id')),
                  username: localStorage.getItem('username'),
                })
              );
            }
            if (this.shadowRoot) {
              this.shadowRoot.innerHTML = '';
              this.shadowRoot.appendChild(getTemplate('inviteWait'));
            }
            this.waitForOpponent();
            this.handleResponse();
          })
          .catch(() => {
            new PopupMessage('Player not found!').render();
          });
      });
    }
  };

  waitForOpponent = () => {
    this.setCancelHandling();
    this.timer = setTimeout(() => {
      this.cancelInvite();
    }, 30000);
  };

  cancelInvite = () => {
    this.socket.send(
      JSON.stringify({ type: 'end', id: localStorage.getItem('id') })
    );
    if (this.timer) {
      clearTimeout(this.timer);
    }
    console.log('cancelling');
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(getTemplate('invitePlayer'));
      this.inviteHandling();
    }
  };

  setCancelHandling = (): void => {
    const cancelButton = this.shadowRoot?.getElementById('cancel');
    if (cancelButton) {
      cancelButton.addEventListener('click', () => this.cancelInvite());
    }
  };

  handleResponse = (): void => {
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'accept') {
        localStorage.setItem('opponentId', String(data.id));
        localStorage.setItem('opponentName', data.username);
        if (this.timer) {
          clearTimeout(this.timer);
        }
        const coinFlip = Math.floor(Math.random() * 2);
        this.socket.send(JSON.stringify({ type: 'coinFlip', coinFlip }));

        this.socket.handleColourChoice(coinFlip);

        this.remove();
      }

      if (data.type === 'reject') {
        this.cancelInvite();
      }
    });
  };
}

customElements.define('x-invite-menu', InvitePlayerWindow);
