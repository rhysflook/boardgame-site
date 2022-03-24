import { AllPieces, GamePiece } from './MoveCalculators/MoveCalculator';
import { Pieces } from './PieceMaker';

export const isInSquare = (
  x: number,
  y: number,
  square: HTMLElement
): boolean => {
  const { top, bottom, left, right } = square.getBoundingClientRect();
  return x >= left && x <= right && y >= top && y <= bottom;
};

export const getSquare = (x: number, y: number): HTMLElement => {
  return document.getElementById(`${x}-${y}`) as HTMLElement;
};

export const detectPiece = <T extends GamePiece>(
  x: number,
  y: number,
  pieces: T[]
): T | null => {
  const piece = pieces.find((piece: T) => {
    return piece.pos.x === x && piece.pos.y === y;
  });
  if (piece) {
    return piece;
  }
  return null;
};

export const isOutOfBounds = (x: number, y: number): boolean => {
  const outsideSpaces = [-1, -2, 8, 9];
  return outsideSpaces.includes(x) || outsideSpaces.includes(y);
};

export const isOpenSpace = <T extends GamePiece>(
  x: number,
  y: number,
  pieces: T[]
): boolean => {
  if (isOutOfBounds(x, y)) {
    return false;
  }
  return !pieces.some((piece: T) => piece.pos.x === x && piece.pos.y === y);
};

export const getCookie = (name: string): string | undefined => {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  const part = parts.pop();
  if (part) return part.split(';').shift();
};

export const reverseCoord = (coord: number): number => {
  return Math.abs(Number(coord) - 7);
};

export const getPieceListAll = <T>(allPieces: AllPieces<T>) => {
  return [
    ...Object.values(allPieces.blacks),
    ...Object.values(allPieces.whites),
  ];
};

export const getPieceList = <T>(pieces: Pieces<T>) => {
  return Object.entries(pieces);
};
