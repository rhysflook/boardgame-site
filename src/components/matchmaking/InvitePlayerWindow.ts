import { AxiosResponse } from '../../../node_modules/axios/index';
import { GameSocket } from '../../socket/GameSocket';
import { getTemplate } from '../../templates/invite';
import { BaseComponent } from '../BaseComponent';
import { PopupMessage } from '../PopupMessage';

const axios = require('axios').default;

export class InvitePlayerWindow extends BaseComponent {
  timer: NodeJS.Timeout | null = null;
  html = `
  <div class="menu-window custom-comp">
  <h1 class="message">Invite a player!</h1>
  <input type="text" id="playerName">
  <button class="base-button" id="inviteButton">Invite</button>
</div>
  `;
  constructor(public socket: GameSocket, public parent: HTMLElement) {
    super();
    this.render(this.html);
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
          .get(`../utils/getPlayer.php/?user=${opponentInput?.value}`)
          .then((res: AxiosResponse) => {
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
          })
          .catch((error: AxiosResponse) => {
            const popup = new PopupMessage('Player not found!', 'left-side');
            const parent = document.querySelector('.screen');
            setTimeout(() => parent?.appendChild(popup), 500);
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
    if (this.timer) {
      clearTimeout(this.timer);
    }
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
}

customElements.define('x-menu-window', InvitePlayerWindow);
