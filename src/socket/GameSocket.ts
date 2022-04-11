import { Chatbox } from '../components/chatbox/Chatbox';
import GameState from '../game/Draughts';
import { ColourSelection } from '../components/matchmaking/ColourSelection';
import { InvitePlayerWindow } from '../components/matchmaking/InvitePlayerWindow';
import { ScoreBoard } from '../components/scoreboard/ScoreBoard';
import { SiteSocket } from './MenuSocket';
import { getCookie } from '../game/utils';
import { InviteHandler } from './InviteHandler';
import { GamePiece } from '../game/Pieces/Piece';

interface Player {
  id: number;
  username: string;
  colour: string;
}

export class GameSocket extends WebSocket implements SiteSocket {
  chatBox: Chatbox | null = null;
  playerOne: Player | null = null;
  playerTwo: Player | null = null;
  inviteUi: InvitePlayerWindow | null = null;
  constructor(url: string, public isChallenger: boolean) {
    super(url);

    this.addEventListener('open', () => {
      new InviteHandler(this);
      this.setupConnection();
      if (isChallenger) {
        this.setupChallenger();
      } else {
        this.setupOpponent();
      }
    });
  }

  setupConnection = (): void => {
    const userId = getCookie('id');
    if (userId) {
      this.send(
        JSON.stringify({
          type: 'start',
          id: Number(userId),
        })
      );
    }
  };

  setupChallenger = (): void => {
    const screen = document.querySelector('.container') as HTMLElement;
    this.inviteUi = new InvitePlayerWindow(this, screen);
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
      JSON.stringify({
        type: 'accept',
        id: Number(localStorage.getItem('id')),
        opponent: Number(opponent),
        username: localStorage.getItem('username'),
      })
    );
  };
}
