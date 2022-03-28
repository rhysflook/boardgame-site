import { Chatbox } from '../chatbox/Chatbox';
import GameState from '../game/Draughts';
import { ColourSelection } from '../matchmaking/ColourSelection';
import { InvitePlayerWindow } from '../matchmaking/InvitePlayerWindow';
import { ScoreBoard } from '../scoreboard/ScoreBoard';

interface Player {
  id: number;
  username: string;
  colour: string;
}

export class GameSocket extends WebSocket {
  chatBox: Chatbox | null = null;
  playerOne: Player | null = null;
  playerTwo: Player | null = null;
  constructor(url: string, public isChallenger: boolean) {
    super(url);
    this.addEventListener('open', () => {
      if (isChallenger) {
        this.setupChallenger();
      } else {
        this.setupOpponent();
      }
    });
  }

  setupChallenger = (): void => {
    this.send(JSON.stringify({ type: 'start', id: 2 }));
    const screen = document.querySelector('.container') as HTMLElement;
    if (screen) {
      screen.appendChild(new InvitePlayerWindow(this, screen));
    }
  };

  handleColourChoice = (coinFlip: number): void => {
    const screen = document.querySelector('.container') as HTMLElement;
    const colourSelection = new ColourSelection(coinFlip);
    screen.appendChild(colourSelection);
    if (coinFlip === 0) {
      colourSelection.getSelection().then((colour) => {
        const scoreboard = ScoreBoard.SetupScoreBoard(colour);

        localStorage.setItem('playerColour', colour);
        this.send(JSON.stringify({ type: 'colourChoice', colour }));
        GameState.setupDraughtsGame('vs', colour, scoreboard, this);
        colourSelection.remove();
      });
    } else {
      colourSelection.waitForPlayer(this).then((colour) => {
        const scoreboard = ScoreBoard.SetupScoreBoard(colour);
        localStorage.setItem('playerColour', colour);
        GameState.setupDraughtsGame('vs', colour, scoreboard, this);
        colourSelection.remove();
      });
    }
  };

  setupOpponent = (): void => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const opponent = urlParams.get('opponent');

    this.send(JSON.stringify({ type: 'start', id: 2 }));
    this.send(
      JSON.stringify({
        type: 'accept',
        id: 2,
        opponent: Number(opponent),
        username: 'Billiam',
      })
    );
    this.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'coinFlip') {
        this.handleColourChoice(data.coinFlip);
      }
    });
  };
}
