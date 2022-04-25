import { BaseComponent } from './BaseComponent';

export class PopupMessage extends BaseComponent {
  constructor(public message: string) {
    super();
    this.render(`
    <link rel="stylesheet" href="../../menu.css">
    <link rel="stylesheet" href="../../styles/popup.css">

    <div id="popup" class="popup-window flex-column-center">
    <button id="okay" class="base-button chibi corner">✕</button>
      <div class="popup-inner">
        <h4 class="error-message">${this.message}</h4>
      </div>
    </div>
  `);
    document.getElementById('screen')?.appendChild(this);
  }

  connectedCallback(): void {
    if (this.shadowRoot) {
      const close = this.shadowRoot.getElementById('okay');
      if (close) {
        close.addEventListener('click', () => {
          this.remove();
        });
      }
    }
    setTimeout(() => this.remove(), 500);
  }
}

customElements.define('popup-message', PopupMessage);
