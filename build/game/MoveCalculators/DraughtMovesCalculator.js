import { detectPiece, isOpenSpace, isOutOfBounds } from '../utils';
import { MoveCalculator } from './MoveCalculator';
export class DraughtMovesCalculator extends MoveCalculator {
    constructor(pieces) {
        super(pieces);
        this.pieces = pieces;
        this.moving = 'blacks';
    }
    calc(colour) {
        this.moving = colour;
        const pieces = this.pieces[colour];
        let moves = [];
        pieces.forEach((piece) => {
            moves = [...moves, ...this.findCaptures(piece)];
        });
        if (moves.length === 0) {
            pieces.forEach((piece) => {
                moves = [...moves, ...this.findMoves(piece)];
            });
        }
        return moves;
    }
    findMoves(piece) {
        const moves = [];
        this.getMoves(piece).forEach((move) => {
            if (isOpenSpace(move[0], move[1], this.allPieces)) {
                moves.push({
                    pos: { x: piece.pos.x, y: piece.pos.y },
                    newPos: { x: move[0], y: move[1] },
                    isCapture: false,
                });
            }
        });
        return moves;
    }
    captureIsLegal(x, y, piece) {
        const open = isOpenSpace(x, y, this.allPieces);
        const outOfBounds = isOutOfBounds(x, y);
        const canCapture = this.canCapture(x, y, piece);
        return !open && !outOfBounds && canCapture;
    }
    getMoves(piece) {
        const xMovement = this.getXDirection(piece);
        const { x, y } = piece.pos;
        return piece.isKing
            ? [
                [x + 1, y + 1],
                [x + 1, y - 1],
                [x - 1, y + 1],
                [x - 1, y - 1],
            ]
            : [
                [x + xMovement, y + 1],
                [x + xMovement, y - 1],
            ];
    }
    getXDirection(piece) {
        if (piece.side === 'top') {
            return 1;
        }
        else {
            return -1;
        }
    }
    findCaptures(piece) {
        const captures = [];
        this.getMoves(piece).forEach((move) => {
            if (this.captureIsLegal(move[0], move[1], piece)) {
                const newSpace = this.spaceAfterCapture(move[0], move[1], piece);
                captures.push({
                    pos: { x: piece.pos.x, y: piece.pos.y },
                    newPos: { x: newSpace[0], y: newSpace[1] },
                    isCapture: true,
                });
            }
        });
        return captures;
    }
    canCapture(moveX, moveY, piece) {
        const enemy = detectPiece(moveX, moveY, this.allPieces);
        const enemyColour = piece.colour === 'black' ? 'white' : 'black';
        const targetSpace = this.spaceAfterCapture(moveX, moveY, piece);
        if (enemy && enemy.colour === enemyColour) {
            return isOpenSpace(targetSpace[0], targetSpace[1], this.allPieces);
        }
        else {
            return false;
        }
    }
    spaceAfterCapture(moveX, moveY, piece) {
        const newX = moveX === 0 ? -1 : Math.abs(piece.pos.x - moveX * 2);
        const newY = moveY === 0 ? -1 : Math.abs(piece.pos.y - moveY * 2);
        return [newX, newY];
    }
}
