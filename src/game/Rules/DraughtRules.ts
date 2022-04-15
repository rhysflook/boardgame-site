import { ScoreBoard } from '../../components/scoreboard/ScoreBoard';
import GameState, { BoardSpace } from '../Draughts';
import { DraughtGamePiece } from '../MoveCalculators/DraughtMovesCalculator';
import { GamePiece } from '../Pieces/Piece';
import { Player } from '../Players/Player';
import { GameResult } from '../../components/game/GameResult';
import { GameColours } from '../index';

export interface Rules<T extends GamePiece> {
  scoreboard: ScoreBoard;
  capturePiece(piece: T, captureKey: number, game: GameState<T>): void;
  handleCapture(capturingPiece: T, capturedPiece: T): void;
  endTurn(game: GameState<T>, movedPiece: T): void;
  winnerCheck(attacker: Player<T>, localColour: GameColours): void;
  getDefender(game: GameState<T>): Player<T>;
  crownPiece(piece: T): void;
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
      this.capturingPiece.moves = game.calculator.findCaptures(
        this.capturingPiece,
        this.capturingPiece.id
      );

      if (Object.keys(this.capturingPiece.moves).length === 0) {
        this.capturingPiece = null;
        game.nextTurn();
      } else {
        game.events.cleanUpEvents();
        game.events.addEvents(this.capturingPiece, this.capturingPiece.moves);
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
      (piece.colour === game.opponentColour && piece.pos.x === 7) ||
      (piece.colour !== game.opponentColour && piece.pos.x === 0)
    ) {
      this.crownPiece(piece);
      return true;
    }
    return false;
  };

  crownPiece = (piece: T): void => {
    piece.isKing = true;
    this.scoreboard.countKing(piece.colour);
    const ele = piece.element;
    ele.classList.add(`${piece.colour}-king`);
  };

  winnerCheck = (attacker: Player<T>, localColour: GameColours): void => {
    if (
      this.scoreboard.playerOne.numOfCaptures === 12 ||
      this.scoreboard.playerTwo.numOfCaptures === 12
    ) {
      const screen = document.getElementById('left-side');

      screen?.appendChild(
        new GameResult(`${attacker.colour === localColour ? 'Lose' : 'Win'}`)
      );
      localStorage.removeItem('gameInProgress');
    }
  };
}
