import { Move } from '../Draughts';
import { GamePiece } from '../Pieces/Piece';
import {
  detectPiece,
  getPieceList,
  getPieceListAll,
  isOpenSpace,
  isOutOfBounds,
} from '../utils';
import { AllPieces, MoveCalculator } from './MoveCalculator';

export interface DraughtGamePiece extends GamePiece {
  isKing: boolean;
}

export class DraughtMovesCalculator
  implements MoveCalculator<DraughtGamePiece>
{
  moving: 'blacks' | 'whites';
  constructor(public pieces: AllPieces<DraughtGamePiece>) {
    this.moving = 'blacks';
  }
  allPieces = getPieceListAll<DraughtGamePiece>(this.pieces);

  calc(
    colour: 'blacks' | 'whites',
    allPieces: AllPieces<DraughtGamePiece>
  ): Move[] {
    this.moving = colour;
    this.pieces = allPieces;
    this.allPieces = getPieceListAll<DraughtGamePiece>(allPieces);
    const pieces = this.pieces[colour];

    let moves: Move[] = [];
    getPieceList(pieces).forEach((data: [string, DraughtGamePiece]) => {
      moves = [...moves, ...this.findCaptures(data[1], Number(data[0]))];
    });
    if (moves.length === 0) {
      getPieceList(pieces).forEach((data: [string, DraughtGamePiece]) => {
        moves = [...moves, ...this.findMoves(data[1], Number(data[0]))];
      });
    }

    return moves;
  }

  findMoves(piece: DraughtGamePiece, key: number): Move[] {
    const moves: Move[] = [];
    this.getMoves(piece).forEach((move) => {
      if (isOpenSpace(move[0], move[1], this.allPieces)) {
        moves.push({
          pos: { x: piece.pos.x, y: piece.pos.y },
          newPos: { x: move[0], y: move[1] },
          isCapture: false,
          key,
          colour: this.moving,
          captureKey: 0,
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

  findCaptures(piece: DraughtGamePiece, key: number): Move[] {
    const captures: Move[] = [];
    this.getMoves(piece).forEach((move) => {
      if (this.captureIsLegal(move[0], move[1], piece)) {
        const newSpace = this.spaceAfterCapture(move[0], move[1], piece);
        captures.push({
          pos: { x: piece.pos.x, y: piece.pos.y },
          newPos: { x: newSpace[0], y: newSpace[1] },
          isCapture: true,
          key,
          colour: this.moving,
          captureKey: this.getCaptureKey(move[0], move[1]),
        });
      }
    });
    return captures;
  }

  getCaptureKey = (moveX: number, moveY: number): number => {
    const enemy = detectPiece<DraughtGamePiece>(moveX, moveY, this.allPieces);
    const enemyColour = this.moving === 'blacks' ? 'whites' : 'blacks';
    let captureKey = 0;
    Object.entries(this.pieces[enemyColour]).forEach(
      (data: [string, DraughtGamePiece]) => {
        const [key, piece] = data;
        if (piece.pos.x === enemy?.pos.x && piece.pos.y === enemy.pos.y) {
          captureKey = Number(key);
        }
      }
    );
    return captureKey;
  };

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
