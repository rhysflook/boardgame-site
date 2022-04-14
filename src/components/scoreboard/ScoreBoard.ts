import { PlayerCard } from './PlayerCard';

export class ScoreBoard {
  static SetupScoreBoard = (colour: string): ScoreBoard => {
    const localUser = localStorage.getItem('username') as string;
    const opponent = localStorage.getItem('opponentName') as string;
    const playerOne = colour === 'blacks' ? localUser : opponent;
    const playerTwo = playerOne === localUser ? opponent : localUser;
    const cardOne = new PlayerCard(playerOne, 'black');
    cardOne.toggle();
    const cardTwo = new PlayerCard(playerTwo, 'white');
    return new ScoreBoard(cardOne, cardTwo);
  };

  constructor(public playerOne: PlayerCard, public playerTwo: PlayerCard) {
    const scores = document.getElementById('scores');
    if (scores) {
      scores.appendChild(this.playerOne);
      scores.appendChild(this.playerTwo);
    }
  }

  countCapture = (colour: string, isKing: boolean): void => {
    if (colour === 'black') {
      this.playerOne.incrementCaptures();
      isKing && this.playerOne.decrementKings();
    } else {
      this.playerTwo.incrementCaptures();
      isKing && this.playerTwo.decrementKings();
    }
  };

  countKing = (colour: string): void => {
    colour === 'black'
      ? this.playerOne.incrementKings()
      : this.playerTwo.incrementKings();
  };

  switchPlayers = (): void => {
    this.playerOne.toggle();
    this.playerTwo.toggle();
  };
}
