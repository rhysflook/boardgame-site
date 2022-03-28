import { Chatbox } from '../chatbox/Chatbox';
import { ColourSelection } from '../matchmaking/ColourSelection';
import { PlayerCard } from '../scoreboard/PlayerCard';
import { ScoreBoard } from '../scoreboard/ScoreBoard';
import { GameSocket } from '../socket/GameSocket';
import GameState from './Draughts';
import { getCookie } from './utils';

// const resetGamePieces = (): void => {
//   localStorage.clear();
//   const oldPieces = document.querySelectorAll(
//     '.black-piece, .white-piece, .black-king, .white-king'
//   );
//   oldPieces.forEach((piece) => {
//     piece.remove();
//   });
// };

const gameType = getCookie('type') as string;
// resetGamePieces();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const opponent = urlParams.get('opponent');

if (gameType === 'ai') {
  const screen = document.querySelector('.container') as HTMLElement;
  const colourSelection = new ColourSelection(0);
  screen.appendChild(colourSelection);
  const chatMenu = document.getElementById('chat-menu') as HTMLElement;

  chatMenu.appendChild(new Chatbox());
  colourSelection.getSelection().then((colour) => {
    localStorage.setItem('playerColour', colour);

    const cardOne = new PlayerCard(
      colour === 'blacks' ? 'Billiam' : 'Boss A.I',
      'black'
    );
    cardOne.select();
    const cardTwo = new PlayerCard(
      colour === 'blacks' ? 'Boss A.I' : 'Billiam',
      'white'
    );
    const area = document.getElementById('scores') as HTMLElement;
    area.appendChild(cardOne);
    area.appendChild(cardTwo);
    const scoreCard = new ScoreBoard(cardOne, cardTwo);
    GameState.setupDraughtsGame('ai', colour, scoreCard);
    colourSelection.remove();
  });
} else if (opponent) {
  new GameSocket('wss://hermy-games-websockets.herokuapp.com/', false);
} else {
  new GameSocket('wss://hermy-games-websockets.herokuapp.com/', true);
}
