import { ColourSelection } from '../matchmaking/ColourSelection';
import { PlayerCard } from '../scoreboard/PlayerCard';
import { ScoreBoard } from '../scoreboard/ScoreBoard';
import { GameSocket } from '../socket/GameSocket';
import GameState from './Draughts';
import { getCookie } from './utils';

const resetGamePieces = (): void => {
  localStorage.clear();
  const oldPieces = document.querySelectorAll(
    '.black-piece, .white-piece, .black-king, .white-king'
  );
  oldPieces.forEach((piece) => {
    piece.remove();
  });
};

const gameType = getCookie('type') as string;
resetGamePieces();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const opponent = urlParams.get('opponent');

if (gameType === 'ai') {
  const screen = document.querySelector('.container') as HTMLElement;
  const colourSelection = new ColourSelection(0);
  screen.appendChild(colourSelection);
  colourSelection.getSelection().then((colour) => {
    localStorage.setItem('playerColour', colour);
    const computerColour = colour === 'blacks' ? 'white' : 'black';
    const playerColour = colour === 'blacks' ? 'black' : 'white';
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
  new GameSocket('ws://localhost:8001/', false);
} else {
  new GameSocket('ws://localhost:8001/', true);
  const area = document.getElementById('scores') as HTMLElement;
  const cardOne = new PlayerCard('Billiam', 'black');
  area.appendChild(cardOne);
  cardOne.select();
  area.appendChild(new PlayerCard('Billy', 'white'));
}