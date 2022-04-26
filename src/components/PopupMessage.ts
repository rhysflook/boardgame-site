import { BaseComponent } from './BaseComponent';

export class PopupMessage extends BaseComponent {
  constructor(public message: string, public parent: string = 'screen') {
    super();

    this.render(`
    <style>
      .chibi {
        position: absolute;
        top: 3px;
        right: 3px;
        font-size: 0.4em;
        width: auto;
        height: auto;
        margin-top: initial;
        background-color: var(--button-colour);
        border: 1px var(--btn-secondary-colour) solid;
        border-radius: 5px;
      }
      .popup-window {
        z-index: 10;
        font-family: var(--font);
        width: auto;
        height: auto;
        padding: 10px;
        background-color: var(--component-bg-colour);
        position: absolute;
        border: var(--fancy-border);
        box-shadow: 5px 10px 20px var(--plain-shadow-color);
        left: 5px;
        top: 5px;
      }
    </style>
    <div id="popup" class="popup-window flex-column-center">
    <button id="okay" part="shadow-button" class="chibi corner">✕</button>
      <div class="popup-inner">
        <h4 class="error-message">${this.message}</h4>
      </div>
    </div>
    `);
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
