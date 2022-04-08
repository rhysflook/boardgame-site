import { getColourSelection } from '../../templates/invite';

export class ColourSelection extends HTMLElement {
  selectedColour: string | null = null;
  whiteButton: HTMLElement;
  blackButton: HTMLElement;

  constructor(public coinFlip: number) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    // this.coinFlip = gameType === 'ai' ? 0 : Math.floor(Math.random() * 2);

    const title =
      this.coinFlip === 0
        ? 'Choose your colour!'
        : 'Opponent is choosing a colour!';
    const template = this.coinFlip === 0 ? 'chooseColour' : 'waitForChoice';
    shadowRoot.appendChild(getColourSelection(title, template));
    this.whiteButton = this.shadowRoot?.getElementById(
      'is-white'
    ) as HTMLElement;

    this.blackButton = this.shadowRoot?.getElementById(
      'is-black'
    ) as HTMLElement;
  }

  getSelection(): Promise<string> {
    const promise = new Promise<string>((resolve) => {
      this.whiteButton.addEventListener('click', () => {
        resolve('whites');
      });
      this.blackButton.addEventListener('click', () => {
        resolve('blacks');
      });

      setTimeout(() => {
        if (this.selectedColour) {
          resolve(this.selectedColour);
        } else {
          resolve('whites');
        }
      }, 20000);
    });

    return promise;
  }

  waitForPlayer = (socket: WebSocket): Promise<string> => {
    const promise = new Promise<string>((resolve) => {
      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        data['type'];
        if (data.type === 'colourChoice') {
          data;
          resolve(data.colour === 'blacks' ? 'whites' : 'blacks');
        }
      });
    });
    return promise;
  };
}

customElements.define('x-colour-select', ColourSelection);
