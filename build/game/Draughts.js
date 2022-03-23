import { EventHandler } from './Events/EventHandler';
import { DraughtMovesCalculator, } from './MoveCalculators/DraughtMovesCalculator';
import { DraughtRules } from './Rules/DraughtRules';
import { getSquare } from './utils';
export default class GameState {
    constructor(gameMode, playerColour, calculator, 
    // public websocket: GameSocket<T>,
    events, pieces, rules) {
        this.gameMode = gameMode;
        this.playerColour = playerColour;
        this.calculator = calculator;
        this.events = events;
        this.pieces = pieces;
        this.rules = rules;
        this.movingPlayer = 'blacks';
        this.moves = [];
        this.opponentColour = this.playerColour === 'blacks' ? 'white' : 'black';
        console.log('hey');
        this.initGame();
    }
    static setupDraughtsGame(gameMode, playerColour, pieces) {
        return new GameState(gameMode, playerColour, new DraughtMovesCalculator(pieces), 
        // new GameSocket<DraughtGamePiece>('', gameMode),
        new EventHandler(), pieces, new DraughtRules());
    }
    initGame() {
        this.moves = [];
        this.moves = this.calculator.calc('blacks');
        this.addEvents();
        if (this.gameMode === 'ai') {
            this.computerTurn();
        }
    }
    addEvents() {
        const pieces = this.getMovablePieces();
        Object.values(pieces).forEach((data) => {
            const { piece, moves } = data;
            const element = getSquare(piece.pos.x, piece.pos.y)
                .children[0];
            this.events.applyEvents(piece, element, moves, this.movePiece);
        });
    }
    getMovablePieces() {
        const pieces = {};
        this.moves.forEach((move) => {
            const movingPieces = this.movingPlayer === 'blacks'
                ? this.pieces.blacks
                : this.pieces.whites;
            const piece = movingPieces.find((movingPiece) => movingPiece.pos.x === move.pos.x && movingPiece.pos.y === move.pos.y);
            if (piece) {
                const key = `${piece.pos.x}-${piece.pos.y}`;
                if (pieces[key]) {
                    pieces[key].moves.push([move.newPos.x, move.newPos.y]);
                }
                else {
                    pieces[key] = { moves: [[move.newPos.x, move.newPos.y]], piece };
                }
            }
        });
        return pieces;
    }
    movePiece(piece, target) {
        const { x, y } = target;
        const chosenMove = this.moves.find((move) => move.pos.x === piece.pos.x &&
            move.pos.y === piece.pos.y &&
            x === move.newPos.y &&
            y === move.newPos.y);
        const enemyPieces = this.movingPlayer === 'blacks' ? this.pieces.whites : this.pieces.blacks;
        if (chosenMove === null || chosenMove === void 0 ? void 0 : chosenMove.isCapture) {
            this.rules.handleCapture(enemyPieces, chosenMove);
        }
        piece.pos.x = x;
        piece.pos.y = y;
    }
    getMovingPieces(colour) {
        return this.movingPlayer === 'blacks'
            ? this.pieces.blacks
            : this.pieces.whites;
    }
    switchColour() {
        this.movingPlayer === 'blacks'
            ? (this.movingPlayer = 'whites')
            : (this.movingPlayer = 'blacks');
    }
    winnerCheck() {
        const container = document.querySelector('.container');
        if (this.pieces.blacks.length === 0 || this.pieces.whites.length === 0) {
            const winnerMessage = document.createElement('h1');
            winnerMessage.innerText = `${this.movingPlayer.toUpperCase()}s Win!`;
            container.appendChild(winnerMessage);
        }
    }
    makeMove(element, piece) {
        // this.dragPiece(element, piece.destination as HTMLElement);
        // setTimeout(() => {
        //   piece.movePiece(element);
        //   if (this.chainCapturing && this.gameMode === 'ai') {
        //     this.chooseComputerMove([piece]);
        //   }
        // }, 290);
    }
    chooseComputerMove(pieceList) {
        const piece = pieceList[Math.floor(Math.random() * pieceList.length)];
        const element = getSquare(piece.pos.x, piece.pos.y)
            .children[0];
        const moves = piece.captures.length > 0 ? piece.captures : piece.moves;
        const move = moves[Math.floor(Math.random() * moves.length)];
        [piece.newPos.x, piece.newPos.y] = move;
        piece.destination = getSquare(move[0], move[1]);
        this.makeMove(element, piece);
    }
    computerTurn() {
        if (this.movingPlayer === this.opponentColour) {
            const pieces = this.getMovingPieces(this.opponentColour);
            const captures = pieces.filter((piece) => piece.captures.length > 0);
            const moves = pieces.filter((piece) => piece.moves.length > 0);
            if (captures.length > 0) {
                this.chooseComputerMove(captures);
            }
            else if (moves.length > 0) {
                this.chooseComputerMove(moves);
            }
            else {
                this.switchColour();
                // this.calcMoves();
            }
        }
    }
    switchPlayer() {
        // this.chainCapturing = null;
        // this.winnerCheck();
        // this.captureAvailable = false;
        // this.switchColour();
        // this.updateStoredData();
        // this.calcMoves();
        // if (this.gameMode === 'ai') {
        //   this.computerTurn();
        // }
    }
    handleOpponentMove(from, to, capturing) {
        const ele = getSquare(from.x, from.y).children[0];
        const pieces = this.getMovingPieces(this.movingPlayer);
        const piece = pieces.filter((piece) => piece.pos.x === from.x && piece.pos.y === from.y)[0];
        piece.destination = getSquare(to.x, to.y);
        piece.newPos.x = to.x;
        piece.newPos.y = to.y;
        if (capturing) {
            piece.capturing = true;
        }
        this.dragPiece(ele, piece.destination);
        setTimeout(() => {
            // piece.moveOpponentPiece(ele);
        }, 290);
    }
    dragPiece(ele, destination) {
        const pos = ele.getBoundingClientRect();
        const newPos = destination.getBoundingClientRect();
        ele.animate([
            {
                transform: `translate(${newPos.x - pos.x + 5}px, ${newPos.y - pos.y + 5}px)`,
            },
        ], {
            duration: 300,
        });
    }
    updateStoredData() {
        localStorage.setItem('moving', this.movingPlayer);
        const whiteData = this.pieces.whites.map((piece) => {
            return { x: piece.pos.x, y: piece.pos.y, colour: piece.colour };
        });
        const blackData = this.pieces.blacks.map((piece) => {
            return { x: piece.pos.x, y: piece.pos.y, colour: piece.colour };
        });
        const piecesJson = JSON.stringify({ whites: whiteData, blacks: blackData });
        localStorage.setItem('pieces', piecesJson);
    }
}
