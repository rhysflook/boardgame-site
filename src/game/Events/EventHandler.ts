import { BoardSpace } from '../Draughts';
import { GamePiece, Moves } from '../Pieces/Piece';
import { Move, Player } from '../Players/Player';
import { getSquare, isInSquare } from '../utils';

export type Callback = () => void;

export class EventHandler<T extends GamePiece> {
  target: BoardSpace = { x: 0, y: 0 };
  space: HTMLElement | null = null;
  eventBoundPieces: HTMLElement[] = [];
  board: DOMRect;
  dragging: boolean = false;
  draggedEle: HTMLElement | null = null;
  draggedPiece: GamePiece | null = null;
  isTraining: boolean = false;
  action: Callback = () => {};
  actionNum: number = 0;
  moveKey: number = 0;
  pieceKey: number = 0;
  movingPlayer: Player<T> | null = null;

  constructor() {
    const boardEle = document.querySelector('.board') as HTMLElement;
    boardEle.addEventListener('mousemove', (e) => {
      if (this.dragging && this.draggedEle && this.draggedPiece) {
        const { width, height } = this.draggedEle.getBoundingClientRect();
        if (this.draggedPiece.moving) {
          this.draggedEle.style.left = e.clientX - width / 2 + 'px';
          this.draggedEle.style.top = e.clientY - height + 'px';
        }
      }
    });
    this.board = boardEle.getBoundingClientRect();
  }

  setupTraining = (action: Callback) => {
    this.isTraining = true;
    this.action = action;
  };

  applyEvents(player: Player<T>): void {
    this.movingPlayer = player;
    this.cleanUpEvents();
    Object.values(player.pieces).forEach((piece: T) => {
      this.addEvents(piece, piece.moves);
    });
  }

  addEvents = (piece: T, moves: Moves): void => {
    if (Object.keys(moves).length > 0) {
      const ele = piece.element;
      ele.onmousedown = (e) => this.handleDragStart(e, piece);
      ele.onmousemove = (e) => this.handleDrag(e, piece, moves);
      ele.onmouseup = (e) => this.handleDragEnd(e, piece);
      this.eventBoundPieces.push(ele);
    }
  };

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
      ele.style.left = e.clientX - width / 2 + 'px';
      piece.left = left;
      piece.top = top;
      piece.width = width;
      piece.height = height;

      piece.moving = true;
      this.dragging = true;
    }
  }

  handleDragEnd(e: MouseEvent, piece: T) {
    if (piece.moving) {
      const ele = piece.element;
      piece.moving = false;
      if (this.space === null) {
        ele.style.left = piece.left + 'px';
        ele.style.top = piece.top + 'px';
        ele.style.position = 'fixed';
      } else {
        getSquare(piece.pos.x, piece.pos.y).innerHTML = '';
        this.space.classList.remove('destination');
        this.space.appendChild(piece.createHTMLElement());
        this.movingPlayer?.updatePieceInfo(
          piece,
          piece.moves[this.moveKey],
          this.target
        );

        if (this.isTraining) {
          this.action();
        }
      }
      this.dragging = false;
      this.draggedEle = null;
      this.draggedPiece = null;
      this.space = null;
    }
  }

  handleDrag(e: MouseEvent, piece: T, moves: Moves) {
    if (piece.moving) {
      Object.entries(moves).forEach((data: [string, Move]) => {
        const [key, move] = data;
        this.handleDestinationHover(e, move, piece.id, Number(key));
      });
    }
  }

  handleDestinationHover(
    e: MouseEvent,
    move: Move,
    pieceKey: number,
    moveKey: number
  ) {
    const { x, y } = move.newPos;
    console.log(x, y);
    const square = document.getElementById(`${x}-${y}`) as HTMLElement;
    if (isInSquare(e.pageX, e.pageY, square)) {
      square.classList.add('destination');
      this.space = square;
      this.target = { x, y };
      this.moveKey = moveKey;
      this.pieceKey = pieceKey;
    } else {
      if (this.space === square) {
        this.moveKey = 0;
        this.pieceKey = 0;
        square.classList.remove('destination');
        this.space = null;
        this.target = { x, y };
      }
    }
  }

  isPlayersPiece = (piece: T): boolean => {
    const movingColour = localStorage.getItem('movingColour');
    const playerColour = localStorage.getItem('playerColour');
    return piece.colour === movingColour && piece.colour === playerColour;
  };
}
