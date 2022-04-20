import GameState, { BoardSpace } from '../Draughts';
import { StartingPos } from '../Generators/DraughtPieceMaker';
import { PieceGenerator, Pieces } from '../Generators/PieceMaker';
import { GameColours } from '../index';
import { GamePiece } from '../Pieces/Piece';
import { getSquare, placePiece } from '../utils';

export interface Move {
  pos: BoardSpace;
  newPos: BoardSpace;
  isCapture: boolean;
  key: number;
  colour: 'blacks' | 'whites';
  captureKey: number;
}

export interface LegalMoves<T> {
  [key: string]: { moves: number[][]; piece: T };
}

export interface Player<T extends GamePiece> {
  game: GameState<T>;
  colour: 'blacks' | 'whites';
  pieces: Pieces<T>;
  pieceMaker: PieceGenerator<T>;
}

export interface SavedPiece {
  x: number;
  y: number;
  colour: GameColours;
  isKing: boolean;
}

export abstract class Player<T extends GamePiece> implements Player<T> {
  moves: Move[] = [];
  constructor(
    public game: GameState<T>,
    public colour: GameColours,
    public pieceMaker: PieceGenerator<T>,
    public isLocal: boolean = false
  ) {
    const pieceColour = this.colour === 'blacks' ? 'blacks' : 'whites';
    const startingPos: StartingPos = this.isLocal
      ? { start: 5, finish: 8, colour: pieceColour, side: 'bottom' }
      : { start: 0, finish: 3, colour: pieceColour, side: 'top' };

    if (
      localStorage.getItem('gameInProgress') &&
      this.game.gameMode !== 'training'
    ) {
      this.pieces = this.replacePieces();
      this.game.calculator.setPieces(Object.values(this.pieces));
    } else {
      this.pieces = this.pieceMaker.makePieces(startingPos);
      this.game.calculator.setPieces(Object.values(this.pieces));
    }
  }

  replacePieces = (): Pieces<T> => {
    const pieces = JSON.parse(
      localStorage.getItem(`${this.colour}-pieces`) as string
    );
    const newPieces: Pieces<T> = {};

    pieces.forEach((piece: SavedPiece) => {
      const key = Object.keys(newPieces).length + 1;
      newPieces[key] = this.pieceMaker.makePiece(
        piece.x,
        piece.y,
        piece.colour,
        this.isLocal ? 'bottom' : 'top',
        key
      );
      if (piece.isKing) {
        this.game.rules.crownPiece(newPieces[key]);
      }
    });
    return newPieces;
  };

  updatePieceInfo = (piece: T, move: Move, target: BoardSpace): void => {
    if (move.isCapture) {
      this.game.rules.capturePiece(piece, move.captureKey, this.game);
    }
    this.game.isOnlineGame() && this.game.socket?.sendMove(move);

    this.game.calculator.changeSpace(piece, target.x, target.y);
    piece.updateCoords(target.x, target.y);
    this.game.rules.endTurn(this.game, piece);
  };

  makeMove = (move: Move, piece: T): void => {
    const targetSpace = getSquare(move.newPos.x, move.newPos.y) as HTMLElement;
    piece.dragPiece(targetSpace as HTMLElement);
    setTimeout(() => {
      piece.replacePiece(targetSpace);
      this.updatePieceInfo(piece as T, move, {
        x: move.newPos.x,
        y: move.newPos.y,
      });
    }, 290);
  };

  canMove = (): boolean => {
    return Object.values(this.pieces).some((piece) => {
      return Object.keys(piece.moves).length > 0;
    });
  };

  clearAllMoves = (): void => {
    Object.values(this.pieces).forEach((piece) => {
      piece.clearMoves();
    });
  };

  updateSavedData = (): void => {
    const saveData = Object.values(this.pieces).map((piece) => {
      const { x, y } = piece.pos;
      const { colour, isKing } = piece;
      return { x, y, colour, isKing };
    });
    localStorage.setItem(this.colour + '-pieces', JSON.stringify(saveData));
  };

  abstract move(): void;
}
