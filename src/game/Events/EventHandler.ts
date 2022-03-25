import GameState, { BoardSpace } from '../Draughts';
import { GamePiece } from '../Pieces/Piece';
import { getSquare, isInSquare } from '../utils';

export class EventHandler<T extends GamePiece> {
  target: BoardSpace = { x: 0, y: 0 };
  space: HTMLElement | null = null;
  eventBoundPieces: HTMLElement[] = [];
  board: DOMRect;
  dragging: boolean = false;
  draggedEle: HTMLElement | null = null;
  draggedPiece: GamePiece | null = null;
  constructor() {
    const scaling = window.outerWidth / window.innerWidth;
    console.log(scaling);
    const boardEle = document.querySelector('.board') as HTMLElement;
    boardEle.addEventListener('mousemove', (e) => {
      if (this.dragging && this.draggedEle && this.draggedPiece) {
        const { width, height, left, top } =
          this.draggedEle.getBoundingClientRect();
        console.log(this.board.x);
        if (this.draggedPiece.moving) {
          this.draggedEle.style.left = e.clientX - this.board.x + 'px';
          this.draggedEle.style.top = e.clientY - height / 2 + 'px';
          // moves.forEach((move) => {
          //   this.handleDestinationHover(e, move, piece);
          // });
        }
      }
    });
    this.board = boardEle.getBoundingClientRect();
    console.log(window.innerWidth);
    console.log(window.outerWidth);
  }

  applyEvents(piece: T, moves: number[][], game: GameState<T>): void {
    const ele = piece.element;
    ele.onmousedown = (e) => this.handleDragStart(e, piece);
    ele.onmousemove = (e) => this.handleDrag(e, piece, moves);
    ele.onmouseup = (e) => this.handleDragEnd(e, piece, game);
    this.eventBoundPieces.push(ele);
  }

  cleanUpEvents = () => {
    this.eventBoundPieces.forEach((element) => {
      element.onmousedown = null;
      element.onmousemove = null;
      element.onmouseup = null;
    });
    this.eventBoundPieces = [];
  };

  handleDragStart(e: MouseEvent, piece: T) {
    const ele = piece.element;

    if (this.isPlayersPiece(piece)) {
      this.draggedEle = piece.element;
      this.draggedPiece = piece;
      const { width, height, left, top } = ele.getBoundingClientRect();
      ele.style.width = `${width}px`;
      ele.style.height = `${height}px`;
      ele.style.position = 'absolute';
      ele.style.left = e.clientX - this.board.x + 'px';
      piece.left = left;
      piece.top = top;
      piece.width = width;
      piece.height = height;

      piece.moving = true;
      this.dragging = true;
    }
  }

  handleDragEnd(e: MouseEvent, piece: T, game: GameState<T>) {
    const ele = piece.element;
    piece.moving = false;
    if (this.space === null) {
      // ele.style.left = '0';
      ele.style.left = piece.left + 'px';
      ele.style.top = piece.top + 'px';
      ele.style.position = 'fixed';
    } else {
      getSquare(piece.pos.x, piece.pos.y).innerHTML = '';
      this.space.classList.remove('destination');
      this.space.appendChild(piece.createHTMLElement());
      game.movePiece(piece, this.target);
    }
    this.dragging = false;
    this.draggedEle = null;
    this.draggedPiece = null;
    this.space = null;
  }

  handleDrag(e: MouseEvent, piece: T, moves: number[][]) {
    if (piece.moving) {
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
