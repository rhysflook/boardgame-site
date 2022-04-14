import { BaseComponent } from '../BaseComponent';

export class GameResult extends BaseComponent {
  html = `
    <link rel="stylesheet" href="../../menu.css">
    <div class="invite-menu">
    <h1 class="popup-message">You ${this.message}!</h1>
    <button id="return" class="popup-button">Menu</button>
    </div>
    `;
  constructor(public message: string) {
    super();
    this.render(this.html);
    this.getByIdAndBind('return', 'click', () => {
      window.location.href = '../menus/game-menu.php';
    });
  }
}

customElements.define('x-winner', GameResult);
