import { DraughtsPieceMaker, StartingPos } from './DraughtPieceMaker';
import { DraughtPiece } from '../Pieces/DraughtsPiece';
import { GamePiece } from '../Pieces/Piece';

export interface Pieces<T> {
  [key: number]: T;
}

export interface PieceGenerator<T> {
  makePieces(pos: StartingPos): Pieces<T>;
}

export class PieceMaker<T extends GamePiece> {
  constructor(public generator: PieceGenerator<T>, public colour: string) {}

  setPieces = (pieces: T[]): void => {
    pieces.forEach((piece) => {
      // piece.game = game;
      const square = document.getElementById(
        `${piece.pos.x}-${piece.pos.y}`
      ) as HTMLElement;
      square.appendChild(piece.element);
    });
  };
}
