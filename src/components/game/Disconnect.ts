import { BaseComponent } from '../BaseComponent';
import { GameResult } from './GameResult';

export class Disconnect extends BaseComponent {
  html = `
    <link rel="stylesheet" href="../../menu.css">
    <div  class="invite-menu">
    <h1 class="popup-message">Opponent Disconnected!</h1>
    <p>If the player doesn't reconnect within 30 seconds, the win goes to you!</p>
    <div id="timeToEnd">30</div>
    </div>
  `;
  timer: HTMLElement;
  timeRemaining: number = 30;
  timeout: NodeJS.Timer | null = null;
  constructor() {
    super();
    this.render(this.html);
    this.timer = this.getById('timeToEnd') as HTMLElement;
    this.id = 'dc';
  }

  connectedCallback() {
    this.timeout = setTimeout(() => {
      const screen = document.getElementById('left-side');
      screen?.appendChild(new GameResult('Win'));
      this.remove();
      localStorage.removeItem('gameInProgress');
    }, 30000);
    setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = String(this.timeRemaining);
    }, 1000);
  }

  reconnect = (): void => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };
}

customElements.define('x-disconnect', Disconnect);
