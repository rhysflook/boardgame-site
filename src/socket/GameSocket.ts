import { Chatbox } from '../chatbox/Chatbox';
import GameState from '../game/Draughts';
import { ColourSelection } from '../matchmaking/ColourSelection';
import { InvitePlayerWindow } from '../matchmaking/InvitePlayerWindow';

export class GameSocket extends WebSocket {
  chatBox: Chatbox | null = null;
  constructor(url: string, public isChallenger: boolean) {
    super(url);
    this.addEventListener('open', () => {
      this.createChatbox();
      this.connectChatbox();
      if (isChallenger) {
        this.setupChallenger();
      } else {
        this.setupOpponent();
      }
    });
  }

  createChatbox = (): void => {
    const chatMenu = document.getElementById('chat-menu') as HTMLElement;
    this.chatBox = new Chatbox(this);
    chatMenu.appendChild(this.chatBox);
  };

  connectChatbox = (): void => {
    this.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat') {
        this.chatBox?.handleMessage(data.message, data.sender);
      }
    });
  };

  setupChallenger = (): void => {
    this.send(JSON.stringify({ type: 'start', id: 2 }));
    const screen = document.querySelector('.container') as HTMLElement;
    if (screen) {
      screen.appendChild(new InvitePlayerWindow(this, screen));
    }
  };

  setupOpponent = (): void => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const opponent = urlParams.get('opponent');

    this.send(JSON.stringify({ type: 'start', id: 2 }));
    this.send(
      JSON.stringify({ type: 'accept', id: 2, opponent: Number(opponent) })
    );
    this.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'coinFlip') {
        const screen = document.querySelector('.container') as HTMLElement;
        const colourSelection = new ColourSelection(data.coinFlip);
        screen.appendChild(colourSelection);
        if (data.coinFlip === 0) {
          colourSelection.getSelection().then((colour) => {
            localStorage.setItem('playerColour', colour);
            this.send(JSON.stringify({ type: 'colourChoice', colour }));
            GameState.setupDraughtsGame('vs', colour, this);
            colourSelection.remove();
          });
        } else {
          colourSelection.waitForPlayer(this).then((colour) => {
            localStorage.setItem('playerColour', colour);
            GameState.setupDraughtsGame('vs', colour, this);
            colourSelection.remove();
          });
        }
      }
    });
  };
}
