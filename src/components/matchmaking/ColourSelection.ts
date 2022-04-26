import { getColourSelection } from '../../templates/invite';
import { BaseComponent } from '../BaseComponent';

export class ColourSelection extends BaseComponent {
  choosing = `
  <style>
  .inner-board {
    display: flex;
    flex-direction: column;
    border:  var(--plain-border)
  }

  .colour-select {
    width: 100px;
    height: 50px;
    display: flex;
  }
  .custom-comp {
    
  }
  .white-square {
    background-color: var(--white-square);
    width: 50px;
    height: 50px;
  }
  
  .black-square {
    background-color: var(--black-square);
    width: 50px;
    height: 50px;
  }
  
  </style>
  <div class="light-bg flex-column-center custom-comp">
    <div class="inner-board">
      <div class="colour-select flex-row centered">
        <div class="black-square flex-row centered">
          <div id="is-white" class="whites-piece select">
          </div>
        </div>
        <div class="white-square flex-row centered"></div>
      </div>
      <div class="colour-select flex-row centered">
        <div class="white-square flex-row centered"></div>
        <div class="black-square flex-row centered">
          <div id="is-black" class="blacks-piece select">
          </div>
        </div>
      </div>
      </div>
  </div>
`;
  waiting = `
<h5>Please wait a moment!</h5>
`;

  selectedColour: string | null = null;
  whiteButton: HTMLElement;
  blackButton: HTMLElement;

  constructor(public coinFlip: number) {
    super();

    const title =
      this.coinFlip === 0
        ? 'Choose your colour!'
        : 'Opponent is choosing a colour!';
    this.render(this.coinFlip === 0 ? this.choosing : this.waiting);
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
