import GameState from '../Draughts';
import { PieceGenerator } from '../Generators/PieceMaker';
import { GamePiece } from '../Pieces/Piece';
import { Move, Player } from './Player';

export class ComputerPlayer<T extends GamePiece> extends Player<T> {
  constructor(
    public colour: 'blacks' | 'whites',
    public game: GameState<T>,
    public pieceMaker: PieceGenerator<T>
  ) {
    super(game, colour, pieceMaker);
  }

  move = (): void => {
    console.log('??');
    if (this.canMove()) {
      const { piece, move } = this.getRandomMove();
      this.makeMove(move, piece);
    } else {
      this.game.nextTurn();
    }
  };

  getRandomMove = (): { piece: T; move: Move } => {
    const pieceList = Object.values(this.pieces).filter(
      (piece) => Object.keys(piece.moves).length > 0
    );
    const piece = pieceList[Math.floor(Math.random() * pieceList.length)];
    const moveList = Object.values(piece.moves);
    const move = moveList[Math.floor(Math.random() * moveList.length)] as Move;
    return { piece, move };
  };
}
