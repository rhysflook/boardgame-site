import { AllPieces } from './MoveCalculators/MoveCalculator';
import { Pieces } from './Generators/PieceMaker';
import { GamePiece } from './Pieces/Piece';

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

export const placePiece = <T extends GamePiece>(
  x: number,
  y: number,
  piece: T
): void => {
  const space = getSquare(x, y);
  space.appendChild(piece.element);
};

export const getPieceEle = (colour: string, key: number): HTMLElement => {
  return document.getElementById(`${colour}-${key}`) as HTMLElement;
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

export const isOpenSpace = (x: number, y: number): boolean => {
  if (isOutOfBounds(x, y)) {
    return false;
  }
  const square = getSquare(x, y) as HTMLElement;
  return square.children[0] === undefined;
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

export const capitalise = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
