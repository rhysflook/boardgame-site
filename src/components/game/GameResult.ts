import { BaseComponent } from '../BaseComponent';

export class GameResult extends BaseComponent {
  html = `
    <link rel="stylesheet" href="../../menu.css">
    <link rel="stylesheet" href="../../styles/menuWindow.css">
    <div class="menu-window">
    <h1 class="popup-message">You ${this.message}!</h1>
    <button id="return" class="base-button">Menu</button>
    </div>
    `;
  constructor(public message: string) {
    super();
  }

  connectedCallback(): void {
    this.render(this.html);
    this.getByIdAndBind('return', 'click', () => {
      window.location.href = '../menus/game-menu.php';
    });
  }
}

customElements.define('x-winner', GameResult);
