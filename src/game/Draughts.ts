import { ScoreBoard } from '../scoreboard/ScoreBoard';
import { EventHandler } from './Events/EventHandler';
import {
  DraughtGamePiece,
  DraughtMovesCalculator,
} from './MoveCalculators/DraughtMovesCalculator';
import { AllPieces, MoveCalculator } from './MoveCalculators/MoveCalculator';
import { PieceMaker } from './PieceMaker';
import { GamePiece } from './Pieces/Piece';
import { DraughtRules } from './Rules/DraughtRules';

import {
  getPieceList,
  getPieceListAll,
  getSquare,
  reverseCoord,
} from './utils';

export interface BoardSpace {
  x: number;
  y: number;
}

export interface Move {
  pos: BoardSpace;
  newPos: BoardSpace;
  isCapture: boolean;
  key: number;
  colour: 'blacks' | 'whites';
  captureKey: number;
}

export interface Rules<T extends GamePiece> {
  scoreboard: ScoreBoard;
  handleCapture(capturingPiece: T, capturedPiece: T): BoardSpace;
  endTurn(game: GameState<T>, movedPiece: T): void;
}

export default class GameState<T extends GamePiece> {
  movingPlayer: 'blacks' | 'whites' = 'blacks';
  opponentColour: 'blacks' | 'whites';
  moves: Move[];

  static setupDraughtsGame(
    gameMode: string,
    playerColour: string,
    scorecard: ScoreBoard,
    socket: WebSocket | null = null
  ): GameState<DraughtGamePiece> {
    const pieces = PieceMaker.setupDraughtsBoard(playerColour);
    return new GameState<DraughtGamePiece>(
      gameMode,
      playerColour,
      new DraughtMovesCalculator(pieces),
      new EventHandler<DraughtGamePiece>(),
      pieces,
      new DraughtRules(scorecard),
      scorecard,
      socket
    );
  }

  constructor(
    public gameMode: string,
    public playerColour: string,
    public calculator: MoveCalculator<T>,
    public events: EventHandler<T>,
    public pieces: AllPieces<T>,
    public rules: Rules<T>,
    public scoreboard: ScoreBoard,
    public socket: WebSocket | null = null
  ) {
    this.moves = [];
    this.opponentColour = this.playerColour === 'blacks' ? 'whites' : 'blacks';
    localStorage.setItem('movingColour', 'blacks');
    this.initGame();
  }

  initGame = (): void => {
    this.moves = [];
    this.moves = this.calculator.calc('blacks', this.pieces);
    this.addEvents();
    if (this.gameMode === 'ai' && this.opponentColour === 'blacks') {
      this.computerTurn();
    } else {
      this.socket?.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'move') {
          const { move } = data;
          let x = reverseCoord(move.pos.x);
          let y = reverseCoord(move.pos.y);
          let newX = reverseCoord(move.newPos.x);
          let newY = reverseCoord(move.newPos.y);

          const piece = this.getPiece(move.colour, move.key);
          const opponentMove = {
            pos: { x, y },
            newPos: { x: newX, y: newY },
            isCapture: move.isCapture,
            key: move.key,
            colour: move.colour,
            captureKey: move.captureKey,
          };
          this.makeMove(opponentMove, piece);
        }
      });
    }
  };

  getPiece = (colour: keyof AllPieces<T>, key: number): T => {
    return this.pieces[colour][key];
  };

  addEvents = (): void => {
    this.events.cleanUpEvents();
    const pieces = this.getMovablePieces();
    Object.values(pieces).forEach((data) => {
      const { piece, moves } = data;
      this.events.applyEvents(piece, moves, this);
    });
  };

  getMovablePieces = (): { [key: string]: { moves: number[][]; piece: T } } => {
    const pieces: { [key: string]: { moves: number[][]; piece: T } } = {};
    this.moves.forEach((move: Move) => {
      const movingPieces =
        this.movingPlayer === 'blacks'
          ? this.pieces.blacks
          : this.pieces.whites;
      const piece = this.getPiece(move.colour, move.key);

      if (piece) {
        const key = `${piece.pos.x}-${piece.pos.y}`;
        if (pieces[key]) {
          pieces[key].moves.push([move.newPos.x, move.newPos.y]);
        } else {
          pieces[key] = { moves: [[move.newPos.x, move.newPos.y]], piece };
        }
      }
    });
    return pieces;
  };

  movePiece = (piece: T, target: BoardSpace): void => {
    const { x, y } = target;
    const chosenMove = this.moves.find(
      (move: Move) =>
        move.pos.x === piece.pos.x &&
        move.pos.y === piece.pos.y &&
        x === move.newPos.x &&
        y === move.newPos.y
    );

    if (chosenMove?.isCapture) {
      const capturedColour =
        this.movingPlayer === 'blacks' ? 'whites' : 'blacks';
      this.rules.handleCapture(
        piece,
        this.getPiece(capturedColour, chosenMove?.captureKey)
      );

      delete this.pieces[capturedColour][chosenMove.captureKey];

      this.calculator.allPieces = getPieceListAll(this.pieces);
    }
    if (this.gameMode === 'vs') {
      const move = {
        pos: { x: piece.pos.x, y: piece.pos.y },
        newPos: {
          x: x,
          y: y,
        },
        isCapture: chosenMove?.isCapture as boolean,
        key: chosenMove?.key as number,
        colour: chosenMove?.colour as 'blacks' | 'whites',
        captureKey: chosenMove?.captureKey as number,
      };
      this.sendMove(move);
    }

    piece.pos.x = x;
    piece.pos.y = y;
    this.rules.endTurn(this, piece);
  };

  sendMove = (move: Move) => {
    this.socket?.send(
      JSON.stringify({ type: 'move', move: JSON.stringify(move) })
    );
  };

  switchColour(): void {
    this.movingPlayer === 'blacks'
      ? (this.movingPlayer = 'whites')
      : (this.movingPlayer = 'blacks');

    localStorage.setItem(
      'movingColour',
      this.movingPlayer === 'blacks' ? 'blacks' : 'whites'
    );
  }

  winnerCheck(): void {
    const container = document.querySelector('.container') as HTMLElement;
    if (this.scoreboard.playerOne.numOfCaptures === 12) {
      const winnerMessage = document.createElement('h1');
      winnerMessage.innerText = `${this.movingPlayer.toUpperCase()} WIN!`;
      container.appendChild(winnerMessage);
    }
  }

  makeMove = (move: Move, piece: T): void => {
    const currentSpace = getSquare(move.pos.x, move.pos.y) as HTMLElement;
    const targetSpace = getSquare(move.newPos.x, move.newPos.y) as HTMLElement;
    this.dragPiece(
      currentSpace.children[0] as HTMLElement,
      targetSpace as HTMLElement
    );
    setTimeout(() => {
      currentSpace.innerHTML = '';
      targetSpace.appendChild(piece.createHTMLElement());
      this.movePiece(piece as T, { x: move.newPos.x, y: move.newPos.y });
    }, 290);
  };

  computerTurn = (): void => {
    if (this.moves.length > 0) {
      const move = this.moves[Math.floor(Math.random() * this.moves.length)];
      const movingPieces =
        this.movingPlayer === 'blacks'
          ? this.pieces.blacks
          : this.pieces.whites;
      const piece = this.getPiece(move.colour, move.key);

      if (piece) {
        this.makeMove(move, piece);
      }
    } else {
      this.switchPlayer();
    }
  };

  switchPlayer = (): void => {
    this.moves = [];
    this.winnerCheck();
    this.switchColour();
    this.moves = this.calculator.calc(this.movingPlayer, this.pieces);
    this.addEvents();
    this.scoreboard.switchPlayers();
    if (this.gameMode === 'ai' && this.movingPlayer === this.opponentColour) {
      this.computerTurn();
    }
  };

  dragPiece(ele: HTMLElement, destination: HTMLElement): void {
    const pos = ele.getBoundingClientRect();
    const newPos = destination.getBoundingClientRect();
    ele.animate(
      [
        {
          transform: `translate(${newPos.x - pos.x + 5}px, ${
            newPos.y - pos.y + 5
          }px)`,
        },
      ],
      {
        duration: 300,
      }
    );
  }

  updateStoredData(): void {
    localStorage.setItem('moving', this.movingPlayer);

    const whiteData = getPieceList(this.pieces.whites).map((piece) => {
      const { x, y, colour, isKing } = piece[1];
      return { x, y, colour, isKing };
    });
    const blackData = getPieceList(this.pieces.blacks).map((piece) => {
      const { x, y, colour, isKing } = piece[1];
      return { x, y, colour, isKing };
    });
    const piecesJson = JSON.stringify({ whites: whiteData, blacks: blackData });
    localStorage.setItem('pieces', piecesJson);
  }
}
