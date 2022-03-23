import { ColourSelection } from '../matchmaking/ColourSelection';
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
    GameState.setupDraughtsGame('ai', colour);
    colourSelection.remove();
  });
} else if (opponent) {
  new GameSocket('ws://localhost:8001/', false);
} else {
  new GameSocket('ws://localhost:8001/', true);
}
