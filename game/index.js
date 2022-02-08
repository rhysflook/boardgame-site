import { DraughtPiece } from './Piece.js'
import GameState from './Draughts.js';
import { createHtmlPiece, getCookie } from './utils.js';

class Player {
  constructor() {
    this.loggedIn = false;
    this.id = null;
  }
}

const setPieces = (pieces, game) => {
  pieces.forEach((piece) => {
    piece.game = game;
    const square = document.getElementById(`${piece.posX}-${piece.posY}`);
    square.appendChild(createHtmlPiece(piece));
  });
};

const createPiece = (x, y, colour) => {
  return new DraughtPiece(x, y, colour);
}

const createPieces = (start, finish, colour) => {
    const pieces = [];
    for (let i = start; i < finish; i++) {
      for (let j = 0; j < 4; j++) {
        const yAxis = i % 2 == 0 ? j * 2 + 1 : j * 2;
        pieces.push(new DraughtPiece(i, yAxis, colour))
      }  
    }
    return pieces;
  }

const getPieces = (colour) => {
  if (colour === 'black') {
    return {blacks: createPieces(5, 8, 'black'), whites: createPieces(0, 3, 'white')};
  } else {
    return {blacks: createPieces(0, 3, 'black'), whites: createPieces(5, 8, 'white')};
  } 
}

const resetGamePieces = () => {
  localStorage.clear();
  const oldPieces = document.querySelectorAll('.black-piece, .white-piece, .black-king, .white-king');
  oldPieces.forEach((piece) => {
    piece.remove();
  })
}

const isNewGame = getCookie('new-game');

if (isNewGame) {
  const gameType = getCookie("type")
  const playerColour = getCookie('colour');
  resetGamePieces();
  const {blacks, whites} = getPieces(playerColour);
  const game = new GameState(blacks, whites, gameType, playerColour);
  game.opponentColour = playerColour === "black" ? "white" : "black";
  localStorage.setItem('enemy', game.computerColour)
  setPieces([...whites, ...blacks], game);
  game.calcMoves();
  if (game.opponentColour === "black" && game.gameMode === "ai") {
    game.computerTurn();
  }
} else {
  const {whites, blacks} = JSON.parse(prevState);
  const whiteObjects = whites.map((white) => {
    return createPiece(white.x, white.y, white.colour)
  })
  const blackObjects = blacks.map((black) => {
    return createPiece(black.x, black.y, black.colour)
  })

  const game = new GameState(blackObjects, whiteObjects, 'vs');
  game.movingPlayer = localStorage.getItem('moving');
  const player = new Player();
  const playerId = getCookie('id');
  game.computerColour = localStorage.getItem('enemy');
  setPieces([...whiteObjects, ...blackObjects], game);
  game.calcMoves();
  game.computerTurn();
}

