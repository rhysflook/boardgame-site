import GameState from '../Draughts';
import { Pieces, PieceGenerator } from '../Generators/PieceMaker';
import { GamePiece } from '../Pieces/Piece';
import { Player } from './Player';

export class OnlinePlayer<T extends GamePiece> extends Player<T> {
  constructor(
    public game: GameState<T>,
    public colour: 'blacks' | 'whites',
    public pieceMaker: PieceGenerator<T>
  ) {
    super(game, colour, pieceMaker);
  }

  move = (): void => {};
}
