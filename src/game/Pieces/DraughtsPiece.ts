import { BoardSpace } from '../Draughts';
import { getSquare } from '../utils';
import { GamePiece } from './Piece';

export class DraughtPiece implements GamePiece {
  isKing = false;
  offset: number[] = [0, 0];
  left: number = 0;
  top: number = 0;
  moving: boolean = false;
  element: HTMLElement;
  width: number = 0;
  height: number = 0;
  constructor(
    public pos: BoardSpace,
    public colour: 'black' | 'white',
    public side: 'top' | 'bottom',
    public id: number
  ) {
    this.element = this.createHTMLElement();
  }

  createHTMLElement(): HTMLDivElement {
    const man = document.createElement('div');
    man.classList.add('piece');
    man.classList.add(`${this.colour}-piece`);
    if (this.isKing) {
      man.classList.add(`${this.colour}-king`);
    }
    this.element = man;
    return man;
  }
}
