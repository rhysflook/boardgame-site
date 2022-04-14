import { BoardSpace } from '../Draughts';
import { Pieces } from '../Generators/PieceMaker';
import { GameColours } from '../index';
import { GamePiece, Moves } from '../Pieces/Piece';
import { Move } from '../Players/Player';
import {
  getPieceList,
  getSquare,
  isOpenSpace,
  isOutOfBounds,
  placePiece,
} from '../utils';
import { MoveCalculator } from './MoveCalculator';

export interface DraughtGamePiece extends GamePiece {
  isKing: boolean;
}

export interface Spaces<T extends GamePiece> {
  [x: number]: {
    [y: number]: T | null;
  };
}

export class DraughtMovesCalculator
  implements MoveCalculator<DraughtGamePiece>
{
  moving: 'blacks' | 'whites';
  defending: 'blacks' | 'whites';
  captureAvailable: boolean = false;
  spaces: Spaces<DraughtGamePiece>;
  constructor(public playerColour: GameColours) {
    this.moving = 'blacks';
    this.defending = 'whites';
    this.spaces = this.setSpaces();
  }

  setSpaces = (): Spaces<DraughtGamePiece> => {
    const spaces: Spaces<DraughtGamePiece> = {};
    for (let i = 0; i < 8; i++) {
      spaces[i] = {};
      for (let j = 0; j < 8; j++) {
        spaces[i][j] = null;
      }
    }

    return spaces;
  };

  setPieces = (pieces: DraughtGamePiece[]): void => {
    pieces.forEach((piece) => {
      console.log(piece);
      const { x, y } = piece.pos;
      this.spaces[piece.pos.x][piece.pos.y] = piece;
      placePiece(x, y, piece);
    });
  };

  changeSpace = (piece: DraughtGamePiece, newX: number, newY: number): void => {
    const { x, y } = piece.pos;
    this.removeFromSpace(x, y);
    this.spaces[newX][newY] = piece;
  };

  removeFromSpace = (x: number, y: number): void => {
    this.spaces[x][y] = null;
  };

  calc(colour: GameColours, pieces: Pieces<DraughtGamePiece>): void {
    this.captureAvailable = false;
    this.moving = colour;
    this.defending = colour === 'blacks' ? 'whites' : 'blacks';
    console.log(this.spaces);
    getPieceList(pieces).forEach((data: [string, DraughtGamePiece]) => {
      const [key, piece] = data;
      piece.moves = this.findCaptures(piece, Number(key));
      if (Object.keys(piece.moves).length > 0 && !this.captureAvailable) {
        this.captureAvailable = true;
      }
    });
    if (!this.captureAvailable) {
      getPieceList(pieces).forEach((data: [string, DraughtGamePiece]) => {
        const [key, piece] = data;
        piece.moves = this.findMoves(piece, Number(key));
      });
    }
  }

  findMoves(piece: DraughtGamePiece, key: number): Moves {
    const moves: Moves = {};
    this.getMoves(piece).forEach((move, index) => {
      if (this.isOpenSpace(move[0], move[1])) {
        console.log('really?');
        moves[index] = this.getMoveInfo(piece, move, key);
      }
    });
    return moves;
  }

  captureIsLegal(x: number, y: number, piece: DraughtGamePiece) {
    return (
      !this.isOpenSpace(x, y) &&
      !isOutOfBounds(x, y) &&
      this.canCapture(x, y, piece)
    );
  }

  isOpenSpace = (x: number, y: number): boolean => {
    return this.spaces[x][y] === null;
  };

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

  findCaptures(piece: DraughtGamePiece, key: number): Moves {
    const captures: Moves = {};
    this.getMoves(piece).forEach((move, index) => {
      if (this.captureIsLegal(move[0], move[1], piece)) {
        captures[index] = this.getMoveInfo(piece, move, key, true);
      }
    });
    return captures;
  }

  getMoveInfo = (
    piece: DraughtGamePiece,
    move: number[],
    key: number,
    isCapture: boolean = false
  ): Move => {
    const newXY = isCapture
      ? this.spaceAfterCapture(move[0], move[1], piece)
      : { x: move[0], y: move[1] };
    return {
      pos: { x: piece.pos.x, y: piece.pos.y },
      newPos: { ...newXY },
      isCapture: isCapture,
      key,
      colour: this.moving,
      captureKey: isCapture ? this.getCaptureKey(move[0], move[1]) : 0,
    };
  };

  getCaptureKey = (moveX: number, moveY: number): number => {
    const space = getSquare(moveX, moveY);
    const [_, id] = space.children[0].id.split('-');
    return Number(id);
  };

  canCapture(moveX: number, moveY: number, piece: DraughtGamePiece): boolean {
    if (this.spaces[moveX][moveY]?.colour === this.defending) {
      const { x, y } = this.spaceAfterCapture(moveX, moveY, piece);
      console.log(x, y);
      return isOpenSpace(x, y);
    }
    return false;
  }

  isOutOfBounds = (x: number, y: number): boolean => {
    const outOfBounds = [-1, -2, 8, 9];
    return outOfBounds.includes(x) || outOfBounds.includes(y);
  };

  spaceAfterCapture(
    moveX: number,
    moveY: number,
    piece: DraughtGamePiece
  ): BoardSpace {
    const x = moveX === 0 ? -1 : Math.abs(piece.pos.x - moveX * 2);
    const y = moveY === 0 ? -1 : Math.abs(piece.pos.y - moveY * 2);
    return { x, y };
  }
}
