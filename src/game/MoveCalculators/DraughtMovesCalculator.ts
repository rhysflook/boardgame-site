import { Move } from '../Draughts';
import { GamePiece } from '../Pieces/Piece';
import { detectPiece, isOpenSpace, isOutOfBounds } from '../utils';
import { MoveCalculator, Pieces } from './MoveCalculator';

export interface DraughtGamePiece extends GamePiece {
  isKing: boolean;
}

export class DraughtMovesCalculator
  implements MoveCalculator<DraughtGamePiece>
{
  moving: 'blacks' | 'whites';
  constructor(public pieces: Pieces<DraughtGamePiece>) {
    this.moving = 'blacks';
  }
  allPieces = [...this.pieces.blacks, ...this.pieces.whites];

  calc(
    colour: 'blacks' | 'whites',
    allPieces: Pieces<DraughtGamePiece>
  ): Move[] {
    this.moving = colour;
    this.pieces = allPieces;
    this.allPieces = [...this.pieces.blacks, ...this.pieces.whites];
    const pieces = this.pieces[colour];

    let moves: Move[] = [];
    pieces.forEach((piece: DraughtGamePiece) => {
      moves = [...moves, ...this.findCaptures(piece)];
    });
    if (moves.length === 0) {
      pieces.forEach((piece: DraughtGamePiece) => {
        moves = [...moves, ...this.findMoves(piece)];
      });
    }

    return moves;
  }

  findMoves(piece: DraughtGamePiece): Move[] {
    const moves: Move[] = [];
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

  captureIsLegal(x: number, y: number, piece: DraughtGamePiece) {
    const open = isOpenSpace(x, y, this.allPieces);
    const outOfBounds = isOutOfBounds(x, y);
    const canCapture = this.canCapture(x, y, piece);

    return !open && !outOfBounds && canCapture;
  }

  getMoves(piece: DraughtGamePiece): number[][] {
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

  getXDirection(piece: DraughtGamePiece): number {
    if (piece.side === 'top') {
      return 1;
    } else {
      return -1;
    }
  }

  findCaptures(piece: DraughtGamePiece): Move[] {
    const captures: Move[] = [];
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

  canCapture(moveX: number, moveY: number, piece: DraughtGamePiece): boolean {
    const enemy = detectPiece(moveX, moveY, this.allPieces);
    const enemyColour = piece.colour === 'black' ? 'white' : 'black';

    const targetSpace = this.spaceAfterCapture(moveX, moveY, piece);
    if (enemy && enemy.colour === enemyColour) {
      return isOpenSpace(targetSpace[0], targetSpace[1], this.allPieces);
    } else {
      return false;
    }
  }

  spaceAfterCapture(
    moveX: number,
    moveY: number,
    piece: DraughtGamePiece
  ): number[] {
    const newX = moveX === 0 ? -1 : Math.abs(piece.pos.x - moveX * 2);
    const newY = moveY === 0 ? -1 : Math.abs(piece.pos.y - moveY * 2);
    return [newX, newY];
  }
}
