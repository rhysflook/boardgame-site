import GameState from '../game/Draughts';
import { GamePiece } from '../game/Pieces/Piece';
import { GameSocket } from './GameSocket';
import { MessageHandler } from './MessageHandler';

interface ICoinFlip {
  type: 'coinFlip';
  coinFlip: number;
}

interface IAccept {
  type: 'accept';
  id: number;
  username: string;
}

interface IReject {
  type: 'reject';
}

export class InviteHandler extends MessageHandler<GameSocket> {
  constructor(socket: GameSocket) {
    super(socket);
  }

  accept = (data: IAccept): void => {
    localStorage.setItem('opponentId', String(data.id));
    localStorage.setItem('opponentName', data.username);

    const coinFlip = Math.floor(Math.random() * 2);
    this.socket.send(JSON.stringify({ type: 'coinFlip', coinFlip }));
    this.socket.handleColourChoice(coinFlip);

    if (this.socket.inviteUi) {
      this.socket.inviteUi.timer && clearTimeout(this.socket.inviteUi.timer);
      this.socket.inviteUi.remove();
    }
  };

  reject = (data: IReject): void => {
    this.socket.inviteUi && this.socket.inviteUi.cancelInvite();
  };

  coinFlip = (data: ICoinFlip): void => {
    this.socket.handleColourChoice(data.coinFlip === 1 ? 0 : 1);
  };

  offline = (): void => {};

  playing = (): void => {};
}
