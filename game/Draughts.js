import { getCookie, getSquare } from "./utils.js";

export default class GameState {
    constructor(blackPieces, whitePieces, gameMode, playerColour) {
      this.playerColour = playerColour;
      this.gameMode = gameMode;
      this.blackPieces = blackPieces;
      this.whitePieces = whitePieces;
      this.captureAvailable = false;
      this.movingPlayer = 'black';
      this.chainCapturing = null;
      this.opponentColour = null;
      if (this.gameMode === "vs") {
        this.initGame();
      }
    }

    initGame() {
      this.websocket = new WebSocket('wss://hermy-games-websockets.herokuapp.com/');
      this.websocket.addEventListener('open', () => {
        if (getCookie('player-1')) {
          const id = getCookie('id');
          this.websocket.send(JSON.stringify({type: 'start', id: id}));
        } else {
          const opponent = getCookie('opponent');
          const event = { type: 'join', token: opponent};
          this.websocket.send(JSON.stringify(event));
        }
      })
      this.websocket.addEventListener('message', ({data}) => {
        const event = JSON.parse(data);
        const move = JSON.parse(event.content);
        if (move.colour === this.movingPlayer) {
          window.setTimeout(() => this.handleOpponentMove(move.from, move.to, move.capturing), 50);

        }
      })
    }
  
    calcMoves() {
      const movingPieces = this.movingPlayer === "black" ? this.blackPieces : this.whitePieces;
      movingPieces.forEach((piece) => {
          piece.findCaptures();
          if (!this.captureAvailable) {
            piece.findMoves();
          }  
      });
      const noMoves = movingPieces.every((piece) => 
        piece.captures.length === 0 && piece.moves.length === 0
      )
      if (noMoves) {
        this.movingPlayer === 'black'
        ? (this.movingPlayer = 'white')
        : (this.movingPlayer = 'black');
        this.calcMoves();
      }
    }
  
    winnerCheck() {
      const container = document.querySelector('.container');
      if (this.blackPieces.length === 0) {
        const winnerMessage = document.createElement('h1');
        winnerMessage.innerText = 'Whites Win!';
        container.appendChild(winnerMessage);
      } else if (this.whitePieces.length === 0) {
        const winnerMessage = document.createElement('h1');
        winnerMessage.innerText = 'Blacks Win!';
        container.appendChild(winnerMessage);
      }
    }
  
    makeMove(element, piece) {
      this.dragPiece(element, piece.destination);
      setTimeout(() => {
        piece.movePiece(element);
        if (this.chainCapturing && this.gameMode === "ai") {
          this.chooseComputerMove([piece]);
        }
      }, 290)
    }
  
    chooseComputerMove(pieceList) {
      const piece = pieceList[Math.floor(Math.random() * pieceList.length)];
      const element = getSquare(piece.posX, piece.posY).children[0];
      let moves; 
      if (piece.captures.length > 0) {
        moves = piece.captures;
        piece.capturing = true;
      } else {
        moves = piece.moves;
      }
      const move = moves[Math.floor(Math.random() * moves.length)];
      [piece.newX, piece.newY] = move;
      piece.destination = getSquare(...move);
      this.makeMove(element, piece);
    }
  
    computerTurn() {
      if (this.movingPlayer === this.opponentColour) {
        const pieces = this.opponentColour === "black" ? this.blackPieces : this.whitePieces;
        const captures = pieces.filter((piece) => piece.captures.length > 0);
        const moves = pieces.filter((piece) => piece.moves.length > 0);
        if (captures.length > 0) {
          this.chooseComputerMove(captures);
        } else if (moves.length > 0) {
          this.chooseComputerMove(moves);
        } else {
          this.movingPlayer === 'black'
          ? (this.movingPlayer = 'white')
          : (this.movingPlayer = 'black');
          this.calcMoves();
        }
      }
    }
  
    switchPlayer() {
      this.chainCapturing = null;
      this.winnerCheck();
      this.captureAvailable = false;
      this.movingPlayer === 'black'
        ? (this.movingPlayer = 'white')
        : (this.movingPlayer = 'black');
      localStorage.setItem('moving', this.movingPlayer);
      const whiteData = this.whitePieces.map((piece) => {
      return { x: piece.posX, y: piece.posY, colour: piece.colour };
      });
      const blackData = this.blackPieces.map((piece) => {
        return { x: piece.posX, y: piece.posY, colour: piece.colour };
      });
      const piecesJson = JSON.stringify({whites: whiteData, blacks: blackData});
      localStorage.setItem('pieces', piecesJson);
      this.calcMoves();
      if (this.gameMode === 'ai') {
        this.computerTurn();
      }
    }

    handleOpponentMove(from, to, capturing) {
      const ele = getSquare(from.x, from.y).children[0];
      const pieces = this.movingPlayer === "black" ? this.blackPieces : this.whitePieces;
      const piece = pieces.filter((piece) => piece.posX === from.x && piece.posY === from.y)[0];
      piece.destination = getSquare(to.x, to.y);
      piece.newX = to.x;
      piece.newY = to.y;
      if (capturing) {
        piece.capturing = true;
      }
      this.dragPiece(ele, piece.destination);
      setTimeout(() => {
        piece.moveOpponentPiece(ele);
      }, 290)
    }

    dragPiece(ele, destination) {
    const pos =  ele.getBoundingClientRect();
    const newPos = destination.getBoundingClientRect();
    ele.animate([
      {transform: `translate(${newPos.x - pos.x + 5}px, ${newPos.y - pos.y + 5}px)`},
    ], {
      duration: 300,
    })
  } 
  }