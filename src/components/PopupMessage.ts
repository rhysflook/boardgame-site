import { BaseComponent } from './BaseComponent';

export class PopupMessage extends BaseComponent {
  constructor(public message: string) {
    super();
    this.style.maxWidth = '40%';
    this.render(`
    <link rel="stylesheet" href="../../menu.css">
    <div id="popup" class="error">
      <div class="popup-inner">
        <h4 class="error-message">${this.message}</h4>
        <button id="okay" parent=${this} class="popup-button short corner">✕</button>
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
    setTimeout(() => this.remove(), 5000);
  }
}

customElements.define('popup-message', PopupMessage);
