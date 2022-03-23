import { getCookie } from '../game/utils';
import { getTemplate } from '../templates/invite';

const menu = document.querySelector('.menu-container') as HTMLElement;

class InviteWindow extends HTMLDivElement {
  constructor(public player: string, public userId: number) {
    super();

    this.classList.add('popup');

    let shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(getTemplate('invitation'));

    const message = shadowRoot.getElementById('message');
    if (message) {
      message.innerText = `${this.player} wants to play!`;
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
    window.location.href = `../../src/game/draughts.php?opponent=${this.userId}`;
  };

  rejectInvite = (): void => {
    socket.send(JSON.stringify({ type: 'end' }));
    this.remove();
  };

  connectedCallback(): void {
    setTimeout(() => this.rejectInvite(), 30000);
  }
}

customElements.define('x-invite-window', InviteWindow, { extends: 'div' });

const socket = new WebSocket('ws://localhost:8001/');
socket.addEventListener('open', () => {
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'invite') {
      menu.appendChild(new InviteWindow(data.userName, data.id));
    }
  });
  const userId = getCookie('id');
  if (userId) {
    socket.send(JSON.stringify({ type: 'start', id: Number(userId) }));
  }
});
