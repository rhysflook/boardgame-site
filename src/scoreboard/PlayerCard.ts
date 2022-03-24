import { getTemplate } from '../templates/invite';

export class PlayerCard extends HTMLElement {
  numOfCaptures: number = 0;
  numOfKings: number = 0;
  card: HTMLElement;
  constructor(public name: string, public colour: string) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const tmpl = document.createElement('template');
    tmpl.innerHTML = this.renderHtml();
    shadowRoot.appendChild(tmpl.content.cloneNode(true));
    this.style.width = '40%';
    this.card = this.shadowRoot?.getElementById('card') as HTMLElement;
  }

  incrementCaptures = (): void => {
    this.numOfCaptures++;
  };

  incrementKings = (): void => {
    this.numOfKings++;
  };

  decrementKings = (): void => {
    this.numOfKings--;
  };

  select = (): void => {
    this.card.className = 'player-info-moving';
  };

  deselect = (): void => {
    this.card.className = 'player-info';
  };

  renderHtml = (): string => {
    return `
    <link rel="stylesheet" href="../../menu.css">
    <div id="card" class="player-info">
      <div class="player-card-right">
        <h1 id="username">${this.name}</h1>
            <div class="black-square light-bg">
            <div id="colour" class="${this.colour} select"></div>
        </div>
      </div>
      <div id="captures">
        <h3>Captures: ${this.numOfCaptures}</h3>
        <h3>Kings: ${this.numOfKings}</h3>
      </div>
    </div>
  `;
  };
}

customElements.define('x-player-card', PlayerCard);
