import { BaseComponent } from './BaseComponent';

export class TutorialMessage extends BaseComponent {
  constructor(public message: string) {
    super();
    this.render(this.template);
  }

  connectedCallback(): void {
    const button = this.shadowRoot?.getElementById('confirmTip');
    button?.addEventListener('click', () => this.remove());
  }

  template = `<link rel="stylesheet" href="../../menu.css">
    <div class="popup tutorial">
    <h2 id="message">${this.message}</h2>
      <button class="popup-button" id="confirmTip">Okay</button> 
    </div>
    `;
}

customElements.define('x-tutorial', TutorialMessage);
