import { Chatbox } from '../components/chatbox/Chatbox';
import GameState from '../game/Draughts';
import { ColourSelection } from '../components/matchmaking/ColourSelection';
import { InvitePlayerWindow } from '../components/matchmaking/InvitePlayerWindow';
import { ScoreBoard } from '../components/scoreboard/ScoreBoard';

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
    this.send(
      JSON.stringify({ type: 'start', id: Number(localStorage.getItem('id')) })
    );
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

    this.send(
      JSON.stringify({ type: 'start', id: Number(localStorage.getItem('id')) })
    );
    this.send(
      JSON.stringify({
        type: 'accept',
        id: Number(localStorage.getItem('id')),
        opponent: Number(opponent),
        username: localStorage.getItem('username'),
      })
    );
    this.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'coinFlip') {
        const coinFlip = data.coinFlip === 1 ? 0 : 1;
        this.handleColourChoice(coinFlip);
      }
    });
  };
}
