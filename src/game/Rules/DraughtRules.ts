import { ScoreBoard } from '../../scoreboard/ScoreBoard';
import GameState, { BoardSpace, Move, Rules } from '../Draughts';
import { DraughtGamePiece } from '../MoveCalculators/DraughtMovesCalculator';
import { getSquare } from '../utils';

export class DraughtRules<T extends DraughtGamePiece> implements Rules<T> {
  constructor(public scoreboard: ScoreBoard) {}
  capturingPiece: T | null = null;

  handleCapture = (capturingPiece: T, capturedPiece: T): BoardSpace => {
    this.capturingPiece = capturingPiece;
    this.scoreboard.countCapture(capturingPiece.colour, capturedPiece.isKing);
    const { x, y } = capturedPiece.pos;
    const square = document.getElementById(`${x}-${y}`) as HTMLElement;
    square.innerHTML = '';
    return { x, y };
  };

  endTurn = (game: GameState<T>, movedPiece: T): void => {
    if (!movedPiece.isKing && this.crownCheck(game, movedPiece)) {
      this.capturingPiece = null;
      game.switchPlayer();
    } else if (this.capturingPiece) {
      const captures = game.calculator.findCaptures(
        this.capturingPiece,
        this.capturingPiece.id
      );
      if (captures.length === 0) {
        this.capturingPiece = null;
        game.switchPlayer();
      } else {
        game.moves = captures;
        game.addEvents();
        if (
          game.gameMode === 'ai' &&
          game.movingPlayer === game.opponentColour
        ) {
          console.log('HANNIN!');
          game.computerTurn();
        }
      }
    } else {
      this.capturingPiece = null;
      game.switchPlayer();
    }
  };

  crownCheck = (game: GameState<T>, piece: T): boolean => {
    if (
      (piece.colour + 's' === game.opponentColour && piece.pos.x === 7) ||
      (piece.colour + 's' !== game.opponentColour && piece.pos.x === 0)
    ) {
      piece.isKing = true;
      this.scoreboard.countKing(piece.colour);
      const ele = getSquare(piece.pos.x, piece.pos.y)
        .children[0] as HTMLElement;
      ele.classList.add(`${piece.colour}-king`);
      return true;
    }
    return false;
  };
}
