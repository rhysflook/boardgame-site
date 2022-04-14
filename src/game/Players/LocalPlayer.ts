import GameState from '../Draughts';
import { PieceGenerator } from '../Generators/PieceMaker';
import { GamePiece } from '../Pieces/Piece';
import { Player } from './Player';

export class LocalPlayer<T extends GamePiece> extends Player<T> {
  constructor(
    public game: GameState<T>,
    public colour: 'blacks' | 'whites',
    public pieceMaker: PieceGenerator<T>
  ) {
    super(game, colour, pieceMaker, true);
  }

  move(): void {
    throw new Error('Method not implemented.');
  }
}
