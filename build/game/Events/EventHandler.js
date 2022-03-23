import { getSquare, isInSquare } from '../utils';
export class EventHandler {
    constructor() {
        this.target = { x: 0, y: 0 };
        this.space = null;
    }
    applyEvents(piece, element, moves, handler) {
        element.addEventListener('mousedown', (e) => this.handleDragStart(e, element, piece));
        element.addEventListener('mousemove', (e) => this.handleDrag(e, element, piece, moves));
        element.addEventListener('mouseup', (e) => this.handleDragEnd(e, element, piece, handler));
        element.addEventListener('mouseout', (e) => this.handleMouseOut(e, element, piece));
    }
    handleDragStart(e, ele, piece) {
        {
            const { width, height, top, left } = ele.getBoundingClientRect();
            ele.style.width = `${width}px`;
            ele.style.height = `${height}px`;
            ele.style.position = 'absolute';
            piece.left = left;
            piece.top = top;
            ele.style.left = e.pageX - 40 + 'px';
            ele.style.top = e.pageY - 40 + 'px';
            piece.moving = true;
            piece.offset = [ele.offsetLeft - e.clientX, ele.offsetTop - e.clientY];
        }
    }
    handleMouseOut(e, ele, piece) {
        if (piece.moving) {
            ele.style.left = e.pageX - 40 + 'px';
            ele.style.top = e.pageY - 40 + 'px';
        }
    }
    handleDragEnd(e, ele, piece, handler) {
        piece.moving = false;
        if (this.space === null) {
            ele.style.left = piece.left + 'px';
            ele.style.top = piece.top + 'px';
            ele.style.position = 'none';
        }
        else {
            handler(piece, this.target);
            console.log('asdsad');
            getSquare(piece.pos.x, piece.pos.y).innerHTML = '';
            this.space.classList.remove('destination');
            this.space.appendChild(piece.createHTMLElement());
        }
    }
    handleDrag(e, ele, piece, moves) {
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
    handleDestinationHover(e, move, piece) {
        const [x, y] = move;
        const square = document.getElementById(`${x}-${y}`);
        if (isInSquare(e.pageX, e.pageY, square)) {
            square.classList.add('destination');
            this.space = square;
            this.target = { x, y };
        }
        else {
            if (this.space === square) {
                square.classList.remove('destination');
                this.space = null;
                this.target = { x, y };
            }
        }
    }
}
