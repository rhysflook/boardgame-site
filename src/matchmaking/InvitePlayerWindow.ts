import { AxiosResponse } from '../../node_modules/axios/index';
import GameState from '../game/Draughts';
import { GameSocket } from '../socket/GameSocket';
import { getTemplate } from '../templates/invite';
import { ColourSelection } from './ColourSelection';

const axios = require('axios').default;

export class InvitePlayerWindow extends HTMLElement {
  invite: Node;
  wait: Node;
  timer: NodeJS.Timeout | null = null;
  constructor(public socket: GameSocket, public parent: HTMLElement) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    this.invite = getTemplate('invitePlayer');
    this.wait = getTemplate('inviteWait');
    shadowRoot.appendChild(this.invite);
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
            if (res.data) {
              this.socket.send(
                JSON.stringify({ type: 'invite', target: res.data.id, id: 2 })
              );
            }
            this.shadowRoot?.children[0].remove();
            this.shadowRoot?.appendChild(this.wait);
            this.waitForOpponent();
            this.handleResponse();
          });
      });
    }
  };

  waitForOpponent = () => {
    this.timer = setTimeout(() => {
      this.cancelInvite();
    }, 30000);
  };

  cancelInvite = () => {
    this.socket.send(JSON.stringify({ type: 'end', id: 2 }));
    this.shadowRoot?.children[0].remove();
    this.shadowRoot?.appendChild(this.invite);
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
        if (this.timer) {
          clearTimeout(this.timer);
        }
        const coinFlip = Math.floor(Math.random() * 2);
        this.socket.send(JSON.stringify({ type: 'coinFlip', coinFlip }));

        const colourSelection = new ColourSelection(coinFlip);
        this.parent.appendChild(colourSelection);

        if (coinFlip === 0) {
          colourSelection.getSelection().then((colour) => {
            localStorage.setItem('playerColour', colour);
            this.socket.send(JSON.stringify({ type: 'colourChoice', colour }));
            GameState.setupDraughtsGame('vs', colour, this.socket);
            colourSelection.remove();
          });
        } else {
          colourSelection.waitForPlayer(this.socket).then((colour) => {
            localStorage.setItem('playerColour', colour);
            GameState.setupDraughtsGame('vs', colour, this.socket);
            colourSelection.remove();
          });
        }

        this.remove();
      }

      if (data.type === 'reject') {
        this.cancelInvite();
      }
    });
  };
}

customElements.define('x-invite-menu', InvitePlayerWindow);
