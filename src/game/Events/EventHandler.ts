import GameState, { BoardSpace } from '../Draughts';
import { GamePiece } from '../Pieces/Piece';
import { getSquare, isInSquare } from '../utils';

export class EventHandler<T extends GamePiece> {
  target: BoardSpace = { x: 0, y: 0 };
  space: HTMLElement | null = null;
  eventBoundPieces: HTMLElement[] = [];
  constructor() {}

  applyEvents(piece: T, moves: number[][], game: GameState<T>): void {
    const ele = piece.element;
    ele.onmousedown = (e) => this.handleDragStart(e, piece);
    ele.onmousemove = (e) => this.handleDrag(e, piece, moves);
    ele.onmouseup = (e) => this.handleDragEnd(e, piece, game);
    ele.onmouseout = (e) => this.handleMouseOut(e, piece);
    this.eventBoundPieces.push(ele);
  }

  cleanUpEvents = () => {
    this.eventBoundPieces.forEach((element) => {
      element.onmousedown = null;
      element.onmousemove = null;
      element.onmouseup = null;
      element.onmouseout = null;
    });
    this.eventBoundPieces = [];
  };

  handleDragStart(e: MouseEvent, piece: T) {
    const ele = piece.element;

    if (this.isPlayersPiece(piece)) {
      const { width, height, left, top } = ele.getBoundingClientRect();
      ele.style.width = `${width}px`;
      ele.style.height = `${height}px`;
      ele.style.position = 'absolute';
      piece.left = left;
      piece.top = top;
      piece.moving = true;
      piece.offset = [ele.offsetLeft - e.clientX, ele.offsetTop - e.clientY];
    }
  }

  handleMouseOut(e: MouseEvent, piece: T) {
    const ele = piece.element;
    // if (piece.moving) {
    //   ele.style.left = e.pageX - 120 + 'px';
    //   ele.style.top = e.pageY - 40 + 'px';
    // }
  }

  handleDragEnd(e: MouseEvent, piece: T, game: GameState<T>) {
    const ele = piece.element;
    piece.moving = false;
    if (this.space === null) {
      ele.style.position = 'none';
      ele.style.left = piece.left + 'px';
      ele.style.top = piece.top + 'px';
    } else {
      getSquare(piece.pos.x, piece.pos.y).innerHTML = '';
      this.space.classList.remove('destination');
      this.space.appendChild(piece.createHTMLElement());
      game.movePiece(piece, this.target);
    }
    this.space = null;
  }

  handleDrag(e: MouseEvent, piece: T, moves: number[][]) {
    const ele = piece.element;
    if (piece.moving) {
      const mousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
      ele.style.left = mousePosition.x + piece.offset[0] + 'px';
      ele.style.top = mousePosition.y + piece.offset[1] + 'px';
      moves.forEach((move) => {
        this.handleDestinationHover(e, move, piece);
      });
    }
  }

  handleDestinationHover(e: MouseEvent, move: number[], piece: T) {
    const [x, y] = move;
    const square = document.getElementById(`${x}-${y}`) as HTMLElement;
    if (isInSquare(e.pageX, e.pageY, square)) {
      square.classList.add('destination');
      this.space = square;
      this.target = { x, y };
    } else {
      if (this.space === square) {
        square.classList.remove('destination');
        this.space = null;
        this.target = { x, y };
      }
    }
  }

  isPlayersPiece = (piece: T): boolean => {
    const movingColour = localStorage.getItem('movingColour');
    const playerColour = localStorage.getItem('playerColour');
    return (
      piece.colour + 's' === movingColour && piece.colour + 's' === playerColour
    );
  };
}
