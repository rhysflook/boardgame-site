import { PlayerCard } from './PlayerCard';

export class ScoreBoard {
  movingPlayer: PlayerCard;
  waitingPlayer: PlayerCard;
  constructor(public playerOne: PlayerCard, public playerTwo: PlayerCard) {
    this.movingPlayer = playerOne;
    this.waitingPlayer = playerTwo;
  }

  switchPlayers = (): void => {
    this.movingPlayer.deselect();
    this.waitingPlayer.select();
    const temp = this.movingPlayer;
    this.movingPlayer = this.waitingPlayer;
    this.waitingPlayer = temp;
  };
}
