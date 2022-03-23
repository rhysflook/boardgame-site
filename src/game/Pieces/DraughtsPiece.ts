import { BoardSpace } from '../Draughts';
import { DraughtGamePiece } from '../MoveCalculators/DraughtMovesCalculator';
import { GamePiece } from './Piece';

export class DraughtPiece implements GamePiece {
  isKing = false;
  offset: number[] = [0, 0];
  left: number = 0;
  top: number = 0;
  moving: boolean = false;
  element: HTMLElement;
  constructor(
    public pos: BoardSpace,
    public colour: 'black' | 'white',
    public side: 'top' | 'bottom'
  ) {
    this.element = this.createHTMLElement();
  }

  crownCheck(ele: HTMLElement): void {
    // if (
    //   (this.colour === this.game.opponentColour && this.pos.x === 7) ||
    //   (this.colour !== this.game.opponentColour && this.pos.x === 0)
    // ) {
    //   this.isKing = true;
    //   ele.classList.add(`${this.colour}-king`);
    // }
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
