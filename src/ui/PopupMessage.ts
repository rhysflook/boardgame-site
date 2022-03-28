export class PopupMessage extends HTMLElement {
  constructor(public message: string) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  render = (): void => {
    const html = `
        <link rel="stylesheet" href="../../menu.css">
        <div id="popup">
            <h4>${this.message}</h4>
            <button is="okay-button" class="popup-button">Okay</button>
        </div>
    `;

    const tmpl = document.createElement('template');
    tmpl.innerHTML = html;
    if (this.shadowRoot) {
      this.shadowRoot.append(tmpl);
      const screen = document.querySelector('.screen');
      if (screen) {
        screen.appendChild(this);
      }
    }
  };
}

export class OkayButton extends HTMLButtonElement {
  constructor(public parent: HTMLElement) {
    super();
    this.addEventListener('click', () => {
      this.parent.remove();
    });
  }
}

customElements.define('popup-message', PopupMessage);
customElements.define('okay-button', OkayButton, { extends: 'button' });
