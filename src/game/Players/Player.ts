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
    this.pieces = this.pieceMaker.makePieces(startingPos);
    console.log(this.pieces);
    this.game.calculator.setPieces(Object.values(this.pieces));
  }

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
    console.log(targetSpace);
    piece.dragPiece(targetSpace as HTMLElement);
    setTimeout(() => {
      piece.replacePiece(targetSpace);
      this.updatePieceInfo(piece as T, move, {
        x: move.newPos.x,
        y: move.newPos.y,
      });
    }, 290);
  };

  dragPiece(ele: HTMLElement, destination: HTMLElement): void {
    const pos = ele.getBoundingClientRect();
    const newPos = destination.getBoundingClientRect();
    ele.animate(
      [
        {
          transform: `translate(${newPos.x - pos.x + 5}px, ${
            newPos.y - pos.y + 5
          }px)`,
        },
      ],
      {
        duration: 300,
      }
    );
  }

  canMove = (): boolean => {
    return Object.values(this.pieces).some((piece) => {
      return Object.keys(piece.moves).length > 0;
    });
  };

  abstract move(): void;
}
