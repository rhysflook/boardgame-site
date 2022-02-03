import { isInSquare, getSquare, createHtmlPiece, isOutOfBounds, isOpenSpace} from './utils.js'

export class Piece {
  constructor(posX, posY, colour) {
    this.offset = [0, 0]
    this.left = 0;
    this.top = 0;
    this.posX = posX;
    this.posY = posY;
    this.colour = colour;
    this.moves = [];
    this.destination = null;
    this.newX = null;
    this.newY = null;
    this.game = null;
  }

  handleDragStart(e, ele) {
    const { width, height } = ele.getBoundingClientRect();
    ele.style.width = `${width}px`;
    ele.style.height = `${height}px`;
  
    ele.style.position = 'absolute';
    this.left = ele.style.left;
    this.top = ele.style.top;
    ele.style.left = e.pageX - 40 + 'px';
    ele.style.top = e.pageY - 40 + 'px';
    this.moving = true;
    this.offset = [ele.offsetLeft - e.clientX, ele.offsetTop - e.clientY];
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
      if (this.game.captureAvailable) {
        this.capturing = true;
        this.captures.forEach((capture) => {
          this.handleDestinationHover(e, capture);
        });
      } else if (this.game.chainCapturing === null) {
        this.moves.forEach((move) => {
          this.handleDestinationHover(e, move);
        });
      }
    }
  }
  
  handleDestinationHover(e, move) {
    const [x, y] = move;
    const square = document.getElementById(`${x}-${y}`);
    if (isInSquare(e.pageX, e.pageY, square)) {
      square.classList.add('destination');
      this.destination = square;
      this.newX = x;
      this.newY = y;
    } else {
      if (this.destination === square) {
        square.classList.remove('destination');
        this.destination = null;
        this.newX = null;
        this.newY = null;
      }
    }
  };

  endTurn() {
  }
  
  getMoves(x, y) {
  }

  findMoves() {
  }

  checkMove(x, y) {
  }

  movePiece(ele) {
  }

  capturePiece() {
  }

  findCaptures() {
  }
  
  canCapture(moveX, moveY) {
  }

}

export class DraughtPiece extends Piece {
  constructor(posX, posY, colour) {
    super(posX, posY, colour)
    this.captures = [];
    this.capturing = false;
    this.isKing = false;
  }

  crownCheck(ele) {
    if (this.colour === this.game.computerColour && this.posX === 7 || 
        this.colour !== this.game.computerColour && this.posX === 0) {
      this.isKing = true;
      ele.classList.add(`${this.colour}-king`);
    } 
  }
  
  spaceAfterCapture(moveX, moveY) {
    const newX = moveX === 0 ? -1 : Math.abs(this.posX - moveX * 2);
    const newY = moveY === 0 ? -1 : Math.abs(this.posY - moveY * 2);
    return [newX, newY];
  }
  
  canCapture(moveX, moveY) {
    const enemy = getSquare(moveX, moveY);
    const enemyColour = (this.game.movingPlayer === 'black' ? 'white' : 'black') + '-piece';
    const isEnemy = enemy.hasChildNodes() ? enemy.children[0].classList.contains(enemyColour) : false;
    return  isEnemy && isOpenSpace(...this.spaceAfterCapture(moveX, moveY))
  }

  endTurn() {
    this.destination = null;
    this.newX = null;
    this.newY = null;
    this.capturing = false;
    this.game.switchPlayer()
  }

  getXDirection() {
    if (this.colour === this.game.computerColour) {
      return 1;
    }
    else {
      return -1;
    }
  }
  
  getMoves(x, y) {
    const xMovement = this.getXDirection();
    return this.isKing
      ? [
          [x + 1, y + 1],
          [x + 1, y - 1],
          [x - 1, y + 1],
          [x - 1, y - 1],
        ]
      : [
          [x + xMovement, y + 1],
          [x + xMovement, y - 1],
        ];
  }

  findMoves() {
    this.moves = [];
    this.getMoves(this.posX, this.posY).forEach((move) => {
      this.checkMove(...move);      
    });
  }

  checkMove(x, y) {
    if (isOpenSpace(x, y)) {
      this.moves.push([x, y]);
    }
  }

  movePiece(ele) {
    if (this.destination === null) {
      ele.style.left = this.left;
      ele.style.top = this.top;
      ele.style.position = 'none';
      this.capturing = false;
    } else {
      getSquare(this.posX, this.posY).innerHTML = '';
      this.destination.classList.remove('destination');
      if (this.capturing) {
        this.capturePiece();
      }
      this.posX = this.newX;
      this.posY = this.newY;
      this.crownCheck(ele);
      this.destination.appendChild(createHtmlPiece(this));
      if (this.captures.length > 0) {
        this.game.chainCapturing = this;
      } else {
        this.endTurn();
      }  
    }
  }

  capturePiece() {
    const game  = this.game;
    const enemyX = this.posX - this.newX < 0 ? this.posX + 1 : this.posX - 1;
    const enemyY = this.posY - this.newY < 0 ? this.posY + 1 : this.posY - 1;
    const enemyPieces = game.movingPlayer === 'black' ? game.whitePieces : game.blackPieces;
    const enemyPiece = enemyPieces.filter(
      (piece) => piece.posX === enemyX && piece.posY === enemyY
    )[0];
    enemyPieces.splice(enemyPieces.findIndex(piece => piece === enemyPiece), 1);
    const square = document.getElementById(`${enemyX}-${enemyY}`);
    square.innerHTML = "";
    this.posX = this.newX;
    this.posY = this.newY;
    this.findCaptures();
  }

  findCaptures() {
    this.captures = [];
    this.getMoves(this.posX, this.posY).forEach((move) => {
      if (!isOpenSpace(...move) && !isOutOfBounds(...move) && this.canCapture(...move)) {
        this.captures.push(this.spaceAfterCapture(...move));
      }
    });
    if (this.captures.length >= 1) {
      this.game.captureAvailable = true;
    }    
  }

}
