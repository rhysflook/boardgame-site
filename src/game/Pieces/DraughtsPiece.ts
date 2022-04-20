import { BoardSpace } from '../Draughts';
import { GameColours } from '../index';
import { getSquare } from '../utils';
import { GamePiece, Moves } from './Piece';

export class DraughtPiece implements GamePiece {
  isKing = false;
  offset: number[] = [0, 0];
  left: number = 0;
  top: number = 0;
  moving: boolean = false;
  element: HTMLElement;
  width: number = 0;
  height: number = 0;
  moves: Moves = {};
  constructor(
    public pos: BoardSpace,
    public colour: GameColours,
    public side: 'top' | 'bottom',
    public id: number
  ) {
    this.element = this.createHTMLElement();
  }

  remove = (): void => {
    const square = document.getElementById(
      `${this.pos.x}-${this.pos.y}`
    ) as HTMLElement;
    square.innerHTML = '';
  };

  replacePiece(destination: HTMLElement): void {
    this.remove();
    destination.appendChild(this.createHTMLElement());
  }

  dragPiece(destination: HTMLElement): void {
    const pos = this.element.getBoundingClientRect();
    const newPos = destination.getBoundingClientRect();
    this.element.animate(
      [
        {
          transform: `translate(${newPos.x - pos.x + 5}px, ${
            newPos.y - pos.y + 5
          }px)`,
        },
      ],
      {
        duration: 300,
      }
    );
  }

  updateCoords(x: number, y: number): void {
    this.pos = { x, y };
  }

  clearMoves = (): void => {
    this.moves = {};
  };

  createHTMLElement(): HTMLDivElement {
    const man = document.createElement('div');
    man.id = `${this.colour}-${this.id}`;
    man.classList.add('piece');
    man.classList.add(`${this.colour}-piece`);
    if (this.isKing) {
      man.classList.add(`${this.colour}-king`);
    }
    this.element = man;
    return man;
  }
}
