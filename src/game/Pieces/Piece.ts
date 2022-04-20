import { BoardSpace } from '../Draughts';
import { GameColours } from '../index';
import { Move } from '../Players/Player';

export interface Moves {
  [key: number]: Move;
}

export interface GamePiece {
  offset: number[];
  left: number;
  top: number;
  pos: BoardSpace;
  colour: GameColours;
  side: 'top' | 'bottom';
  moving: boolean;
  element: HTMLElement;
  id: number;
  width: number;
  height: number;
  moves: Moves;

  createHTMLElement(): HTMLElement;
  updateCoords(x: number, y: number): void;
  remove(): void;
  dragPiece(destination: HTMLElement): void;
  replacePiece(destination: HTMLElement): void;
  clearMoves(): void;
}
