import { Chatbox } from '../components/chatbox/Chatbox';
import { ScoreBoard } from '../components/scoreboard/ScoreBoard';
import { GameSocket } from '../socket/GameSocket';
import { DraughtTraining } from './training/DraughtTraining';
import { EventHandler } from './Events/EventHandler';
import {
  DraughtGamePiece,
  DraughtMovesCalculator,
} from './MoveCalculators/DraughtMovesCalculator';
import { MoveCalculator } from './MoveCalculators/MoveCalculator';
import { PieceGenerator } from './Generators/PieceMaker';
import { GamePiece } from './Pieces/Piece';
import { DraughtRules, Rules } from './Rules/DraughtRules';
import { GameHandler } from '../socket/GameHandler';
import { DraughtsPieceMaker } from './Generators/DraughtPieceMaker';
import { GameColours } from './index';
import {
  Player,
  LocalPlayer,
  OnlinePlayer,
  ComputerPlayer,
} from './Players/index';
export interface BoardSpace {
  x: number;
  y: number;
}

export default class GameState<T extends GamePiece> {
  attacker: Player<T>;
  opponentColour: GameColours;
  chatbox: Chatbox;
  localPlayer: Player<T>;
  opponent: Player<T>;

  static setupDraughtsGame(
    gameMode: string,
    playerColour: GameColours,
    scorecard: ScoreBoard,
    socket: GameSocket | null = null
  ): GameState<DraughtGamePiece> {
    return new GameState<DraughtGamePiece>(
      gameMode,
      playerColour,
      new DraughtMovesCalculator(playerColour),
      new EventHandler<DraughtGamePiece>(),
      new DraughtRules(scorecard),
      scorecard,
      socket,
      new DraughtsPieceMaker()
    );
  }

  constructor(
    public gameMode: string,
    public playerColour: GameColours,
    public calculator: MoveCalculator<T>,
    public events: EventHandler<T>,
    public rules: Rules<T>,
    public scoreboard: ScoreBoard,
    public socket: GameSocket | null = null,
    public generator: PieceGenerator<T>
  ) {
    localStorage.setItem('movingColour', 'blacks');
    this.opponentColour = this.playerColour === 'blacks' ? 'whites' : 'blacks';
    this.chatbox = new Chatbox(this.gameMode === 'vs' ? this.socket : null);
    this.localPlayer = new LocalPlayer(this, this.playerColour, this.generator);
    this.opponent = this.setOpponent();
    this.attacker =
      this.playerColour === 'blacks' ? this.localPlayer : this.opponent;
    this.initGame();
  }

  setOpponent = (): Player<T> => {
    if (this.gameMode === 'ai') {
      return new ComputerPlayer(this.opponentColour, this, this.generator);
    } else {
      return new OnlinePlayer(this, this.opponentColour, this.generator);
    }
  };

  initGame = (): void => {
    if (this.gameMode === 'training') {
      new DraughtTraining(this);
    } else {
      this.calculator.calc(this.attacker.colour, this.attacker.pieces);
      this.events.applyEvents(this.attacker);
      if (this.gameMode === 'ai' && this.opponentColour === 'blacks') {
        this.opponent.move();
      } else {
        this.socket && new GameHandler(this.socket, this);
      }
    }
  };

  getAllPieces = (): T[] => {
    return [
      ...Object.values(this.localPlayer.pieces),
      ...Object.values(this.opponent.pieces),
    ];
  };

  nextTurn = (): void => {
    this.rules.winnerCheck(this.attacker);
    this.attacker = this.rules.getDefender(this);
    this.calculator.calc(this.attacker.colour, this.attacker.pieces);
    localStorage.setItem('movingColour', this.attacker.colour);
    this.events.applyEvents(this.attacker);
    this.scoreboard.switchPlayers();
    this.computerIsAttacking() && this.opponent.move();
  };

  isOnlineGame = (): boolean => {
    return (
      this.gameMode === 'vs' &&
      this.attacker.colour === this.playerColour &&
      this.socket !== null
    );
  };

  computerIsAttacking = (): boolean => {
    return (
      this.gameMode === 'ai' && this.attacker.colour === this.opponentColour
    );
  };

  // updateStoredData(): void {
  //   localStorage.setItem('moving', this.attacker);

  //   const whiteData = getPieceList(this.pieces.whites).map((piece) => {
  //     const { x, y, colour, isKing } = piece[1];
  //     return { x, y, colour, isKing };
  //   });
  //   const blackData = getPieceList(this.pieces.blacks).map((piece) => {
  //     const { x, y, colour, isKing } = piece[1];
  //     return { x, y, colour, isKing };
  //   });
  //   const piecesJson = JSON.stringify({ whites: whiteData, blacks: blackData });
  //   localStorage.setItem('pieces', piecesJson);
  // }
}
