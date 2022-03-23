export const isInSquare = (x, y, square) => {
    const { top, bottom, left, right } = square.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
};
export const getSquare = (x, y) => {
    return document.getElementById(`${x}-${y}`);
};
export const detectPiece = (x, y, pieces) => {
    const piece = pieces.find((piece) => piece.pos.x === x && piece.pos.y === y);
    if (piece) {
        return piece;
    }
    return null;
};
export const isOutOfBounds = (x, y) => {
    const outsideSpaces = [-1, -2, 8, 9];
    return outsideSpaces.includes(x) || outsideSpaces.includes(y);
};
export const isOpenSpace = (x, y, pieces) => {
    if (isOutOfBounds(x, y)) {
        return false;
    }
    return !pieces.some((piece) => piece.pos.x === x && piece.pos.y === y);
};
export const getCookie = (name) => {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    const part = parts.pop();
    if (part)
        return part.split(';').shift();
};
export const reverseCoord = (coord) => {
    return Math.abs(Number(coord) - 7);
};
