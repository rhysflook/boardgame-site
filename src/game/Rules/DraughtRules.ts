import { ScoreBoard } from '../../scoreboard/ScoreBoard';
import GameState, { BoardSpace, Move, Rules } from '../Draughts';
import { DraughtGamePiece } from '../MoveCalculators/DraughtMovesCalculator';
import { getSquare } from '../utils';

export class DraughtRules<T extends DraughtGamePiece> implements Rules<T> {
  capturingPiece: T | null = null;

  handleCapture = (
    capturingPiece: T,
    scoreboard: ScoreBoard,
    move: Move
  ): BoardSpace => {
    this.capturingPiece = capturingPiece;

    const { enemyX, enemyY } = this.findCapturedPiece(move);
    const square = document.getElementById(
      `${enemyX}-${enemyY}`
    ) as HTMLElement;
    square.innerHTML = '';
    return { x: enemyX, y: enemyY };
  };

  findCapturedPiece = (move: Move): { enemyX: number; enemyY: number } => {
    const enemyX =
      move.pos.x - move.newPos.x < 0 ? move.pos.x + 1 : move.pos.x - 1;
    const enemyY =
      move.pos.y - move.newPos.y < 0 ? move.pos.y + 1 : move.pos.y - 1;
    return { enemyX, enemyY };
  };

  endTurn = (game: GameState<T>, movedPiece: T): void => {
    if (!movedPiece.isKing && this.crownCheck(game, movedPiece)) {
      this.capturingPiece = null;
      game.switchPlayer();
    } else if (this.capturingPiece) {
      const captures = game.calculator.findCaptures(this.capturingPiece);
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
      const ele = getSquare(piece.pos.x, piece.pos.y)
        .children[0] as HTMLElement;
      ele.classList.add(`${piece.colour}-king`);
      return true;
    }
    return false;
  };
}
