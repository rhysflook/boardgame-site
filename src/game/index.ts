import { AxiosResponse } from '../../node_modules/axios/index';
import { Chatbox } from '../components/chatbox/Chatbox';
import { ColourSelection } from '../components/matchmaking/ColourSelection';
import { PlayerCard } from '../components/scoreboard/PlayerCard';
import { ScoreBoard } from '../components/scoreboard/ScoreBoard';
import { GameSocket } from '../socket/GameSocket';
import GameState from './Draughts';
import { getCookie } from './utils';

const axios = require('axios').default;

export type GameColours = 'blacks' | 'whites';

const quitButton = document.getElementById('quit');
quitButton?.addEventListener('click', () => {
  window.location.href = '../../backend/menus/game-menu.php';
});

const gameType = getCookie('type') as string;
// resetGamePieces();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const opponent = urlParams.get('opponent');

if (gameType === 'training') {
  const cardOne = new PlayerCard(
    localStorage.getItem('username') as string,
    'black'
  );
  cardOne.select();
  const chatBox = new Chatbox();
  const cardTwo = new PlayerCard('Boss A.I', 'white');

  const scoreCard = new ScoreBoard(cardOne, cardTwo);
  GameState.setupDraughtsGame('training', 'blacks', scoreCard);
} else if (gameType === 'ai') {
  if (localStorage.getItem('gameInProgress')) {
    const colour = localStorage.getItem('playerColour');
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
    GameState.setupDraughtsGame('ai', colour as GameColours, scoreCard);
  } else {
    const screen = document.querySelector('.container') as HTMLElement;
    const colourSelection = new ColourSelection(0);
    screen.appendChild(colourSelection);
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
      const chatBox = new Chatbox();
      GameState.setupDraughtsGame('ai', colour as GameColours, scoreCard);
      colourSelection.remove();
    });
  }
} else if (opponent) {
  axios.get('../../backend/auth/socket-url.php').then((res: AxiosResponse) => {
    if (res) {
      new GameSocket(res.data, false);
    }
  });
} else {
  axios.get('../../backend/auth/socket-url.php').then((res: AxiosResponse) => {
    if (res) {
      new GameSocket(res.data, true);
    }
  });
}
