import { capitalise } from '../../game/utils';

export class PlayerCard extends HTMLElement {
  numOfCaptures: number = 0;
  numOfKings: number = 0;
  card: HTMLElement;
  constructor(public name: string, public colour: string) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' }) as ShadowRoot;
    shadowRoot.appendChild(this.renderHtml());
    this.classList.add('card-comp');
    this.card = this.shadowRoot?.getElementById('card') as HTMLElement;
  }

  rerender = (): void => {
    const scores = this.shadowRoot?.getElementById('captures');
    if (scores) {
      scores.innerHTML = `
      <p>Captures: ${this.numOfCaptures}</p>
      <p>Kings: ${this.numOfKings}</p>
      `;
    }
  };

  incrementCaptures = (): void => {
    this.numOfCaptures++;
    this.rerender();
  };

  incrementKings = (): void => {
    this.numOfKings++;
    this.rerender();
  };

  decrementKings = (): void => {
    this.numOfKings--;
    this.rerender();
  };

  toggle = (): void => {
    if (this.card.className === 'player-info') {
      this.card.className = 'player-info-moving';
    } else {
      this.card.className = 'player-info';
    }
  };

  select = (): void => {
    this.card.className = 'player-info-moving';
  };

  deselect = (): void => {
    this.card.className = 'player-info';
  };

  renderHtml = (): Node => {
    const tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <link rel="stylesheet" href="../../menu.css">
    <link rel="stylesheet" href="../../styles/scoreboard.css">
    <div id="card" class="player-info">
    <h2 id="username">${capitalise(this.name)}</h2>
    <div class="card-bottom">

            <div class="black-square light-bg flex-column-center">
            <div id="colour" class="${this.colour}s-piece select"></div>
      </div>
      <div id="captures">
        <p>Captures: ${this.numOfCaptures}</p>
        <p>Kings: ${this.numOfKings}</p>
      </div>
      </div>
    </div>
    `;
    return tmpl.content.cloneNode(true);
  };
}

customElements.define('x-player-card', PlayerCard);
