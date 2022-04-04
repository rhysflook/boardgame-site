import { PlayerCard } from './PlayerCard';

export class ScoreBoard {
  static SetupScoreBoard = (colour: string): ScoreBoard => {
    const localUser = localStorage.getItem('username') as string;
    const opponent = localStorage.getItem('opponentName') as string;
    const playerOne = colour === 'blacks' ? localUser : opponent;
    const playerTwo = playerOne === localUser ? opponent : localUser;
    const cardOne = new PlayerCard(playerOne, 'black');
    cardOne.select();
    const cardTwo = new PlayerCard(playerTwo, 'white');
    return new ScoreBoard(cardOne, cardTwo);
  };

  movingPlayer: PlayerCard;
  waitingPlayer: PlayerCard;
  constructor(public playerOne: PlayerCard, public playerTwo: PlayerCard) {
    this.movingPlayer = playerOne;
    this.waitingPlayer = playerTwo;
  }

  switchPlayers = (): void => {
    console.log('switching');
    this.movingPlayer.toggle();
    this.waitingPlayer.toggle();
    const temp = this.movingPlayer;
    this.movingPlayer = this.waitingPlayer;
    this.waitingPlayer = temp;
  };
}
