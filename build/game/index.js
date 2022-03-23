import GameState from './Draughts';
import { DraughtPiece } from './Pieces/DraughtsPiece';
import { getCookie } from './utils';
document.body.addEventListener('change', (e) => console.log(e));
const setPieces = (pieces) => {
    pieces.forEach((piece) => {
        // piece.game = game;
        const square = document.getElementById(`${piece.pos.x}-${piece.pos.y}`);
        square.appendChild(piece.createHTMLElement());
    });
};
// const createPiece = (x: number, y: number, colour: string): DraughtPiece => {
//   return new DraughtPiece({ x, y }, colour);
// };
const createPieces = (start, finish, colour, side) => {
    const pieces = [];
    for (let i = start; i < finish; i++) {
        for (let j = 0; j < 4; j++) {
            const yAxis = i % 2 == 0 ? j * 2 + 1 : j * 2;
            pieces.push(new DraughtPiece({ x: i, y: yAxis }, colour, side));
        }
    }
    return pieces;
};
const getPieces = (colour) => {
    if (colour === 'black') {
        return {
            blacks: createPieces(5, 8, 'black', 'bottom'),
            whites: createPieces(0, 3, 'white', 'top'),
        };
    }
    else {
        return {
            blacks: createPieces(0, 3, 'black', 'top'),
            whites: createPieces(5, 8, 'white', 'bottom'),
        };
    }
};
const resetGamePieces = () => {
    localStorage.clear();
    const oldPieces = document.querySelectorAll('.black-piece, .white-piece, .black-king, .white-king');
    oldPieces.forEach((piece) => {
        piece.remove();
    });
};
const isNewGame = getCookie('new-game');
if (isNewGame) {
    const gameType = getCookie('type');
    const playerColour = getCookie('colour');
    resetGamePieces();
    const { blacks, whites } = getPieces(playerColour);
    setPieces([...whites, ...blacks]);
    const game = GameState.setupDraughtsGame('ai', 'blacks', { blacks, whites });
}
