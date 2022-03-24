import { DraughtsPieceMaker } from './Generators/DraughtPieceMaker';
import { DraughtPiece } from './Pieces/DraughtsPiece';
import { GamePiece } from './Pieces/Piece';

export interface Pieces<T> {
  [key: number]: T;
}

export interface PieceGenerator<T> {
  makePieces(
    start: number,
    finish: number,
    colour: 'black' | 'white',
    side: 'top' | 'bottom'
  ): Pieces<T>;
}

export class PieceMaker<T extends GamePiece> {
  static setupDraughtsBoard = (
    colour: string
  ): { blacks: Pieces<DraughtPiece>; whites: Pieces<DraughtPiece> } => {
    return new PieceMaker<DraughtPiece>(
      new DraughtsPieceMaker(),
      colour
    ).getPieces();
  };

  constructor(public generator: PieceGenerator<T>, public colour: string) {}

  getPieces = (): { blacks: Pieces<T>; whites: Pieces<T> } => {
    const pieces = this.createPieces();
    this.setPieces([
      ...Object.values(pieces.blacks),
      ...Object.values(pieces.whites),
    ]);
    return pieces;
  };

  setPieces = (pieces: T[]): void => {
    pieces.forEach((piece) => {
      // piece.game = game;
      const square = document.getElementById(
        `${piece.pos.x}-${piece.pos.y}`
      ) as HTMLElement;
      square.appendChild(piece.element);
    });
  };

  createPieces = (): { blacks: Pieces<T>; whites: Pieces<T> } => {
    if (this.colour === 'blacks') {
      return {
        blacks: this.generator.makePieces(5, 8, 'black', 'bottom'),
        whites: this.generator.makePieces(0, 3, 'white', 'top'),
      };
    } else {
      return {
        blacks: this.generator.makePieces(0, 3, 'black', 'top'),
        whites: this.generator.makePieces(5, 8, 'white', 'bottom'),
      };
    }
  };
}
