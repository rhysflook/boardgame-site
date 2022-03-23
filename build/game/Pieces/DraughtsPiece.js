import { Piece } from './Piece';
import { getSquare, reverseCoord } from '../utils';
export class DraughtPiece extends Piece {
    constructor(pos, colour, side) {
        super(pos, colour, side);
        this.pos = pos;
        this.colour = colour;
        this.side = side;
        this.isKing = false;
    }
    crownCheck(ele) {
        // if (
        //   (this.colour === this.game.opponentColour && this.pos.x === 7) ||
        //   (this.colour !== this.game.opponentColour && this.pos.x === 0)
        // ) {
        //   this.isKing = true;
        //   ele.classList.add(`${this.colour}-king`);
        // }
    }
    endTurn() {
        this.destination = null;
        // deleted reseting of newPos here, make sure it doesn't break anything
        this.capturing = false;
        // this.game.switchPlayer();
    }
    moveOpponentPiece(ele) {
        getSquare(this.pos.x, this.pos.y).innerHTML = '';
        if (this.capturing) {
            this.capturePiece();
        }
        this.pos.x = this.newPos.x;
        this.pos.y = this.newPos.y;
        this.crownCheck(ele);
        if (this.destination) {
            this.destination.classList.remove('destination');
            this.destination.appendChild(this.createHTMLElement());
        }
        if (this.captures.length > 0) {
            // this.game.chainCapturing = this;
        }
        else {
            this.endTurn();
        }
    }
    movePiece(ele) {
        if (this.destination === null) {
            ele.style.left = String(this.left) + 'px';
            ele.style.top = String(this.top) + 'px';
            ele.style.position = 'none';
            this.capturing = false;
        }
        else {
            getSquare(this.pos.x, this.pos.y).innerHTML = '';
            this.destination.classList.remove('destination');
            // if (this.game.gameMode === 'vs') {
            //   this.sendMoveInfo();
            // }
            if (this.capturing) {
                this.capturePiece();
            }
            this.pos.x = this.newPos.x;
            this.pos.y = this.newPos.y;
            this.crownCheck(ele);
            this.destination.appendChild(this.createHTMLElement());
            if (this.captures.length > 0) {
                // this.game.chainCapturing = this;
            }
            else {
                this.endTurn();
            }
        }
    }
    capturePiece() {
        // const game = this.game;
        // const enemyX =
        //   this.pos.x - this.newPos.x < 0 ? this.pos.x + 1 : this.pos.x - 1;
        // const enemyY =
        //   this.pos.y - this.newPos.y < 0 ? this.pos.y + 1 : this.pos.y - 1;
        // const enemyPieces =
        //   game.movingPlayer === 'black' ? game.whitePieces : game.blackPieces;
        // const enemyPiece = enemyPieces.filter(
        //   (piece) => piece.pos.x === enemyX && piece.pos.y === enemyY
        // )[0];
        // enemyPieces.splice(
        //   enemyPieces.findIndex((piece) => piece === enemyPiece),
        //   1
        // );
        // const square = document.getElementById(
        //   `${enemyX}-${enemyY}`
        // ) as HTMLElement;
        // square.innerHTML = '';
        // this.pos.x = this.newPos.x;
        // this.pos.y = this.newPos.y;
        // this.findCaptures();
    }
    sendMoveInfo() {
        const move = JSON.stringify({
            from: {
                x: reverseCoord(this.pos.x),
                y: reverseCoord(this.pos.y),
            },
            to: {
                x: reverseCoord(this.newPos.x),
                y: reverseCoord(this.newPos.y),
            },
            capturing: this.capturing,
            colour: this.colour,
        });
        // this.game.websocket.send(JSON.stringify({ type: 'move', content: move }));
    }
    createHTMLElement() {
        const man = document.createElement('div');
        man.classList.add('piece');
        man.classList.add(`${this.colour}-piece`);
        if (this.isKing) {
            man.classList.add(`${this.colour}-king`);
        }
        // man.addEventListener('mousedown', (e) => {
        //   console.log(man.style.left);
        //   // if (this.game.movingPlayer === this.colour) {
        //   this.handleDragStart(e, man);
        //   // }
        // });
        // man.addEventListener('mousemove', (e) => this.handleDrag(e, man));
        // man.addEventListener('mouseup', (e) => this.handleDragEnd(e, man));
        // man.addEventListener('mouseout', (e) => this.handleMouseOut(e, man));
        return man;
    }
}
