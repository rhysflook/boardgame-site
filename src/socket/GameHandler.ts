import GameState from '../game/Draughts';
import { GamePiece } from '../game/Pieces/Piece';
import { reverseCoord } from '../game/utils';
import { GameSocket } from './GameSocket';
import { MessageHandler } from './MessageHandler';

export interface IMove {
  type: 'move';
  move: string;
}

export class GameHandler<
  T extends GamePiece
> extends MessageHandler<GameSocket> {
  constructor(socket: GameSocket, public game: GameState<T>) {
    super(socket);
  }

  move = (data: IMove): void => {
    const move = JSON.parse(data.move);
    if (move.colour !== this.game.playerColour) {
      let x = reverseCoord(move.pos.x);
      let y = reverseCoord(move.pos.y);
      let newX = reverseCoord(move.newPos.x);
      let newY = reverseCoord(move.newPos.y);

      const piece = this.game.opponent.pieces[13 - move.key];
      const opponentMove = {
        pos: { x, y },
        newPos: { x: newX, y: newY },
        isCapture: move.isCapture,
        key: 13 - move.key,
        colour: move.colour,
        captureKey: 13 - move.captureKey,
      };

      this.game.opponent.makeMove(opponentMove, piece);
    }
  };
}
