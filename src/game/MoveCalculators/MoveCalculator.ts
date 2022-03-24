import { Move } from '../Draughts';
import { Pieces } from '../PieceMaker';

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
  pieces: AllPieces<T>;
  moving: 'blacks' | 'whites';
  calc(colour: 'blacks' | 'whites', allPieces: AllPieces<T>): Move[];
  findCaptures(piece: T, key: number): Move[];
  getCaptureKey(moveX: number, moveY: number): number;
  findMoves(piece: T, key: number): Move[];
  allPieces: T[];
}
