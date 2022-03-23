import GameState, { BoardSpace } from '../Draughts';
import { getCookie, isInSquare } from '../utils';

export interface GamePiece {
  offset: number[];
  left: number;
  top: number;
  pos: BoardSpace;
  colour: 'black' | 'white';
  side: 'top' | 'bottom';
  moving: boolean;
  element: HTMLElement;
  createHTMLElement(): HTMLElement;
}
