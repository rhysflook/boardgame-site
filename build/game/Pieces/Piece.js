import { getCookie, isInSquare } from '../utils';
export class Piece {
    constructor(pos, colour, side) {
        this.pos = pos;
        this.colour = colour;
        this.side = side;
        this.offset = [0, 0];
        this.left = 0;
        this.top = 0;
        this.moves = [];
        this.captures = [];
        this.destination = null;
        this.moving = false;
        this.capturing = false;
        this.captureAvailable = false;
        this.playerColour = getCookie('colour');
    }
    set newPos(newPos) {
        this.newPos = newPos;
    }
    handleDragStart(e, ele) {
        if (this.colour === this.playerColour) {
            const { width, height, left, top } = ele.getBoundingClientRect();
            ele.style.width = `${width}px`;
            ele.style.height = `${height}px`;
            ele.style.position = 'absolute';
            console.log(left, top);
            this.left = left;
            this.top = top;
            ele.style.left = e.pageX - 40 + 'px';
            ele.style.top = e.pageY - 40 + 'px';
            this.moving = true;
            this.offset = [ele.offsetLeft - e.clientX, ele.offsetTop - e.clientY];
        }
    }
    handleMouseOut(e, ele) {
        if (this.moving) {
            ele.style.left = e.pageX - 40 + 'px';
            ele.style.top = e.pageY - 40 + 'px';
        }
    }
    handleDragEnd(e, ele) {
        this.moving = false;
        this.movePiece(ele);
    }
    handleDrag(e, ele) {
        if (this.moving) {
            const mousePosition = {
                x: e.clientX,
                y: e.clientY,
            };
            ele.style.left = mousePosition.x + this.offset[0] + 'px';
            ele.style.top = mousePosition.y + this.offset[1] + 'px';
        }
    }
    handleDestinationHover(e, move) {
        const [x, y] = move;
        const square = document.getElementById(`${x}-${y}`);
        if (isInSquare(e.pageX, e.pageY, square)) {
            square.classList.add('destination');
            this.destination = square;
            this.newPos = { x, y };
        }
        else {
            if (this.destination === square) {
                square.classList.remove('destination');
                this.destination = null;
                this.newPos = { x, y };
            }
        }
    }
}
