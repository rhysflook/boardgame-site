import { getSquare } from "./utils.js";

export default class GameState {
    constructor(blackPieces, whitePieces) {
      this.gameMode = 'ai';
      this.blackPieces = blackPieces;
      this.whitePieces = whitePieces;
      this.captureAvailable = false;
      this.movingPlayer = 'black';
      this.chainCapturing = null;
      this.computerColour = null;
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
      if (this.movingPlayer === this.computerColour) {
        const pieces = this.computerColour === "black" ? this.blackPieces : this.whitePieces;
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