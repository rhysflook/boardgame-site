import { PieceGenerator } from '../PieceMaker';
import { DraughtPiece } from '../Pieces/DraughtsPiece';
import { GamePiece } from '../Pieces/Piece';

export class DraughtsPieceMaker implements PieceGenerator<DraughtPiece> {
  makePieces(
    start: number,
    finish: number,
    colour: 'black' | 'white',
    side: 'top' | 'bottom'
  ): DraughtPiece[] {
    const pieces = [];
    for (let i = start; i < finish; i++) {
      for (let j = 0; j < 4; j++) {
        const yAxis = i % 2 == 0 ? j * 2 + 1 : j * 2;
        pieces.push(new DraughtPiece({ x: i, y: yAxis }, colour, side));
      }
    }
    return pieces;
  }
}
