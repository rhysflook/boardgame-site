export class PopupMessage extends HTMLElement {
  constructor(public message: string) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
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
  }

  render = (): void => {
    const html = `
        <link rel="stylesheet" href="../../menu.css">
        <div id="popup" class="error">
          <div class="popup-inner">
            <h4 class="error-message">${this.message}</h4>
            <button id="okay" parent=${this} class="popup-button short corner">✕</button>
          </div>
        </div>
    `;

    const tmpl = document.createElement('template');
    tmpl.innerHTML = html;
    if (this.shadowRoot) {
      this.shadowRoot.append(tmpl.content.cloneNode(true));
      const screen = document.querySelector('.screen');
      if (screen) {
        screen.appendChild(this);
      }
    }
  };
}

customElements.define('popup-message', PopupMessage);
