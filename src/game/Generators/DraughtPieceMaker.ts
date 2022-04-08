import { PieceGenerator, Pieces } from './PieceMaker';
import { DraughtPiece } from '../Pieces/DraughtsPiece';
import { GamePiece } from '../Pieces/Piece';

export class DraughtsPieceMaker implements PieceGenerator<DraughtPiece> {
  makePieces(
    start: number,
    finish: number,
    colour: 'black' | 'white',
    side: 'top' | 'bottom'
  ): Pieces<DraughtPiece> {
    const pieces: Pieces<DraughtPiece> = {};

    for (let i = start; i < finish; i++) {
      for (let j = 0; j < 4; j++) {
        const yAxis = i % 2 == 0 ? j * 2 + 1 : j * 2;
        pieces[Object.keys(pieces).length + 1] = new DraughtPiece(
          { x: i, y: yAxis },
          colour,
          side,
          Object.keys(pieces).length + 1
        );
      }
    }
    return pieces;
  }
}
