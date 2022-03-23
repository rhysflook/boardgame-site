import { Move } from '../Draughts';

export interface Pieces<T> {
  blacks: T[];
  whites: T[];
}

export interface GamePiece {
  pos: { x: number; y: number };
  colour: string;
  side: string;
}

export interface MoveCalculator<T extends GamePiece> {
  pieces: Pieces<T>;
  moving: 'blacks' | 'whites';
  calc(colour: 'blacks' | 'whites', allPieces: Pieces<T>): Move[];
  findCaptures(piece: T): Move[];
  findMoves(piece: T): Move[];
  allPieces: T[];
}
