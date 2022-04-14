import { ScoreBoard } from '../../components/scoreboard/ScoreBoard';
import GameState, { BoardSpace } from '../Draughts';
import { DraughtGamePiece } from '../MoveCalculators/DraughtMovesCalculator';
import { GamePiece } from '../Pieces/Piece';
import { Player } from '../Players/Player';
import { getSquare } from '../utils';

export interface Rules<T extends GamePiece> {
  scoreboard: ScoreBoard;
  capturePiece(piece: T, captureKey: number, game: GameState<T>): void;
  handleCapture(capturingPiece: T, capturedPiece: T): void;
  endTurn(game: GameState<T>, movedPiece: T): void;
  winnerCheck(attacker: Player<T>): void;
  getDefender(game: GameState<T>): Player<T>;
}

export class DraughtRules<T extends DraughtGamePiece> implements Rules<T> {
  constructor(public scoreboard: ScoreBoard) {}
  capturingPiece: T | null = null;

  handleCapture = (capturingPiece: T, capturedPiece: T): void => {
    this.capturingPiece = capturingPiece;
    this.scoreboard.countCapture(capturingPiece.colour, capturedPiece.isKing);
    capturedPiece.remove();
  };

  capturePiece = (piece: T, captureKey: number, game: GameState<T>): void => {
    const defender = this.getDefender(game);
    const defenderPiece = defender.pieces[captureKey];
    game.calculator.removeFromSpace(defenderPiece.pos.x, defenderPiece.pos.y);
    this.handleCapture(piece, defender.pieces[captureKey]);
    delete defender.pieces[captureKey];
  };

  getDefender = (game: GameState<T>): Player<T> => {
    if (game.attacker.colour !== game.localPlayer.colour) {
      return game.localPlayer;
    }
    return game.opponent;
  };

  endTurn = (game: GameState<T>, movedPiece: T): void => {
    if (!movedPiece.isKing && this.crownCheck(game, movedPiece)) {
      this.capturingPiece = null;
      game.nextTurn();
    } else if (this.capturingPiece) {
      const captures = game.calculator.findCaptures(
        this.capturingPiece,
        this.capturingPiece.id
      );
      if (Object.keys(captures).length === 0) {
        this.capturingPiece = null;
        game.nextTurn();
      } else {
        game.events.cleanUpEvents();
        game.events.addEvents(this.capturingPiece, captures);
        if (
          game.gameMode === 'ai' &&
          game.attacker.colour === game.opponentColour
        ) {
          game.opponent.move();
        }
      }
    } else {
      this.capturingPiece = null;
      game.nextTurn();
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

  winnerCheck = (attacker: Player<T>): void => {
    const container = document.querySelector('.container') as HTMLElement;
    if (this.scoreboard.playerOne.numOfCaptures === 12) {
      const winnerMessage = document.createElement('h1');
      winnerMessage.innerText = `${attacker.colour.toUpperCase()} WIN!`;
      container.appendChild(winnerMessage);
    }
  };
}
