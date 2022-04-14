import { Pieces } from '../Generators/PieceMaker';
import { Moves } from '../Pieces/Piece';
import { Move } from '../Players/Player';
import { Spaces } from './DraughtMovesCalculator';

export interface AllPieces<T> {
  blacks: Pieces<T>;
  whites: Pieces<T>;
}

export interface GamePiece {
  pos: { x: number; y: number };
  colour: string;
  side: string;
}

export interface MoveCalculator<T extends GamePiece> {
  moving: 'blacks' | 'whites';
  spaces: Spaces;
  captureAvailable: boolean;
  calc(colour: 'blacks' | 'whites', pieces: Pieces<T>): void;
  findCaptures(piece: T, key: number): Moves;
  getCaptureKey(moveX: number, moveY: number): number;
  findMoves(piece: T, key: number): Moves;
  setPieces(pieces: T[]): void;
  changeSpace(piece: T, newX: number, newY: number): void;
  removeFromSpace(x: number, y: number): void;
}
