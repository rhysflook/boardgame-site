import { AxiosResponse } from '../../node_modules/axios/index';
import { Chatbox } from '../chatbox/Chatbox';
import { ColourSelection } from '../matchmaking/ColourSelection';
import { PlayerCard } from '../scoreboard/PlayerCard';
import { ScoreBoard } from '../scoreboard/ScoreBoard';
import { GameSocket } from '../socket/GameSocket';
import GameState from './Draughts';
import { getCookie } from './utils';
const axios = require('axios').default;

// const resetGamePieces = (): void => {
//   localStorage.clear();
//   const oldPieces = document.querySelectorAll(
//     '.black-piece, .white-piece, .black-king, .white-king'
//   );
//   oldPieces.forEach((piece) => {
//     piece.remove();
//   });
// };

const quitButton = document.getElementById('quit');
quitButton?.addEventListener('click', () => {
  window.location.href = '../menu/game-menu.php';
});

const gameType = getCookie('type') as string;
// resetGamePieces();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const opponent = urlParams.get('opponent');

if (gameType === 'training') {
  const chatMenu = document.getElementById('chat-menu') as HTMLElement;
  chatMenu.appendChild(new Chatbox());
  const cardOne = new PlayerCard(
    localStorage.getItem('username') as string,
    'black'
  );
  cardOne.select();
  const cardTwo = new PlayerCard('Boss A.I', 'white');
  const scoreCard = new ScoreBoard(cardOne, cardTwo);
  GameState.setupDraughtsGame('training', 'blacks', scoreCard);
} else if (gameType === 'ai') {
  const screen = document.querySelector('.container') as HTMLElement;
  const colourSelection = new ColourSelection(0);
  screen.appendChild(colourSelection);
  const chatMenu = document.getElementById('chat-menu') as HTMLElement;

  chatMenu.appendChild(new Chatbox());
  colourSelection.getSelection().then((colour) => {
    localStorage.setItem('playerColour', colour);

    const cardOne = new PlayerCard(
      colour === 'blacks'
        ? (localStorage.getItem('username') as string)
        : 'Boss A.I',
      'black'
    );
    cardOne.select();
    const cardTwo = new PlayerCard(
      colour === 'blacks'
        ? 'Boss A.I'
        : (localStorage.getItem('username') as string),
      'white'
    );

    const scoreCard = new ScoreBoard(cardOne, cardTwo);
    GameState.setupDraughtsGame('ai', colour, scoreCard);
    colourSelection.remove();
  });
} else if (opponent) {
  axios.get('../socket-url.php').then((res: AxiosResponse) => {
    if (res) {
      new GameSocket(res.data, false);
    }
  });
} else {
  axios.get('../socket-url.php').then((res: AxiosResponse) => {
    if (res) {
      new GameSocket(res.data, true);
    }
  });
}
