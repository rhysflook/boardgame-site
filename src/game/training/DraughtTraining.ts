import { TutorialMessage } from '../../components/TutorialMessage';
import GameState from '../Draughts';
import { GamePiece } from '../Pieces/Piece';
import { Move } from '../Players/index';
import { getSquare } from '../utils';

// posX, posY, newX, newY, isCapture, key,, captureKey

export type SetMove = [number, number, number, number, boolean, number, number];

const playerMoves: SetMove[] = [
  [5, 2, 4, 1, false, 2, 0],
  [4, 1, 2, 3, true, 2, 10],
  [6, 1, 5, 2, false, 5, 0],
  [5, 2, 4, 1, false, 5, 0],
  [5, 4, 3, 2, true, 3, 7],
  [4, 1, 3, 0, false, 5, 0],
  [6, 5, 4, 3, true, 7, 9],
  [4, 3, 2, 5, true, 7, 11],
  [5, 6, 4, 7, false, 4, 0],
  [4, 7, 2, 5, true, 4, 12],
  [2, 5, 0, 3, true, 4, 2],
  [0, 3, 2, 5, true, 4, 3],
  [2, 5, 4, 3, true, 4, 8],
  [3, 0, 2, 1, false, 5, 0],
  [0, 0, 0, 0, false, 0, 0],
];

const computerMoves: SetMove[] = [
  [2, 3, 3, 2, false, 10, 0],
  [1, 4, 3, 2, true, 7, 2],
  [2, 5, 3, 4, false, 11, 0],
  [3, 2, 4, 3, false, 7, 0],
  [2, 1, 4, 3, true, 9, 3],
  [4, 3, 5, 4, false, 9, 0],
  [0, 0, 0, 0, false, 0, 0],
  [1, 6, 3, 4, true, 8, 7],
  [2, 7, 3, 6, false, 12, 0],
  [0, 3, 1, 4, false, 2, 0],
  [0, 5, 1, 4, false, 3, 0],
  [0, 0, 0, 0, false, 0, 0],
  [0, 7, 1, 6, false, 4, 0],
  [1, 0, 3, 2, true, 5, 5],
  [3, 2, 5, 4, true, 5, 4],
];

const messages: string[] = [
  'Welcome! In draughts you can move your pieces forward diagonally one space at a time. Give it a try!',
  "When an opponent piece is next to yours, if the the landing space is clear, you have to jump it and capture it.<br><br> If you capture all of your opponent's pieces, you win.",
  "But remember, your opponent can do the same to you. Let's try moving another piece.",
  'When moving, try to move to a space where your other pieces can block captures.',
  "You can capture another of your opponent's pieces, let's go!",
  "The spaces on the edge of the board are the safest, let's move there.",
  "Looks like you can capture another piece, let's do it!",
  'After capturing, if you land next to another capturable piece, you can capture that as well!',
  "Let's move to another safe space.",
  'Your opponent just handed you a free capture, go get it!',
  'Another mistake by your opponent, take advantage!',
  'If one of your pieces reaches the other side of the board, it will get kinged and can move backwards.',
  'Another consecutive capture!',
  "Let's try moving here next.",
  "Oh no, you lost your king! Don't forget that your opponent can also capture consecutively!<br><br>Why don't you try finishing the rest of the game by yourself?",
];

export class DraughtTraining<T extends GamePiece> {
  flashingPiece: NodeJS.Timer | null = null;
  flashingSquare: HTMLElement | null = null;
  playerMoving: boolean = true;
  playerMoveCount: number = 0;
  computerMoveCount: number = 0;
  messageCount: number = 0;
  screen: HTMLElement | null = null;
  tutorialMessage: HTMLElement | null = null;
  constructor(public game: GameState<T>) {
    this.screen = document.getElementById('left-side') as HTMLElement;
    this.game.events.setupTraining(this.setupMove);
    this.setupMove();
  }

  setupMove = (): void => {
    if (this.tutorialMessage) {
      this.tutorialMessage.remove();
    }
    if (this.computerMoveCount === 15) {
      this.messageCount--;
      this.showMessage();
      this.game.gameMode = 'ai';
      this.game.events.isTraining = false;
    } else {
      if (this.playerMoving) {
        this.showMessage();
        if (this.playerMoveCount !== 14) {
          this.playerMove(playerMoves[this.playerMoveCount]);
        } else {
          this.togglePlayer();
          this.setupMove();
        }
        this.playerMoveCount++;
      } else {
        if (![6, 11].includes(this.computerMoveCount)) {
          this.computerMove(computerMoves[this.computerMoveCount]);
        } else {
          this.clearFlashingPiece();
          this.togglePlayer();
        }

        this.computerMoveCount++;
        setTimeout(() => this.setupMove(), 300);
      }
    }
  };

  showMessage = (): void => {
    if (this.screen) {
      this.tutorialMessage = new TutorialMessage(messages[this.messageCount]);
      this.screen.appendChild(this.tutorialMessage);
      this.messageCount++;
    }
  };

  playerMove = (move: SetMove): void => {
    this.markPiece(move[5]);
    this.startFlashingPiece(move[2], move[3]);
    const moves = {
      0: this.getMove(move),
    };
    this.game.localPlayer.pieces[move[5]].moves = moves;
    this.game.events.addEvents(this.game.localPlayer.pieces[move[5]], moves);
    this.togglePlayer();
  };

  computerMove = (move: SetMove): void => {
    this.clearFlashingPiece();
    this.game.opponent.makeMove(
      this.getMove(move),
      this.game.opponent.pieces[move[5]]
    );
    this.togglePlayer();
  };

  clearFlashingPiece = (): void => {
    if (this.flashingPiece) {
      clearInterval(this.flashingPiece);
      this.flashingPiece = null;
    }
    if (this.flashingSquare) {
      this.flashingSquare.classList.remove('destination');
      this.flashingSquare = null;
    }
  };

  startFlashingPiece = (x: number, y: number): void => {
    this.flashingSquare = getSquare(x, y) as HTMLElement;
    this.flashingPiece = setInterval(() => {
      if (
        this.flashingSquare &&
        this.flashingSquare.classList.contains('destination')
      ) {
        this.flashingSquare.classList.remove('destination');
      } else {
        if (this.flashingSquare) {
          this.flashingSquare.classList.add('destination');
        }
      }
    }, 500);
  };

  markPiece = (key: number): void => {
    this.game.localPlayer.pieces[key].element.style.backgroundColor =
      'rgb(198, 165, 221)';
  };

  getMove = (move: SetMove): Move => {
    return {
      pos: { x: move[0], y: move[1] },
      newPos: { x: move[2], y: move[3] },
      isCapture: move[4],
      key: move[5],
      colour: this.playerMoving ? 'blacks' : 'whites',
      captureKey: move[6],
    };
  };

  togglePlayer = (): void => {
    this.playerMoving = !this.playerMoving;
  };
}
