import { PieceGenerator, Pieces } from './PieceMaker';
import { DraughtPiece } from '../Pieces/DraughtsPiece';
import { GamePiece } from '../Pieces/Piece';
import { GameColours } from '../index';

export interface StartingPos {
  start: number;
  finish: number;
  colour: GameColours;
  side: 'top' | 'bottom';
}

export class DraughtsPieceMaker implements PieceGenerator<DraughtPiece> {
  makePieces = (pos: StartingPos): Pieces<DraughtPiece> => {
    const pieces: Pieces<DraughtPiece> = {};

    for (let i = pos.start; i < pos.finish; i++) {
      for (let j = 0; j < 4; j++) {
        const yAxis = i % 2 == 0 ? j * 2 + 1 : j * 2;
        pieces[Object.keys(pieces).length + 1] = this.makePiece(
          i,
          yAxis,
          pos.colour,
          pos.side,
          Object.keys(pieces).length + 1
        );
      }
    }
    return pieces;
  };

  makePiece = (
    x: number,
    y: number,
    colour: GameColours,
    side: 'top' | 'bottom',
    id: number
  ): DraughtPiece => {
    const piece = new DraughtPiece({ x, y }, colour, side, id);

    return piece;
  };
}
