export const isInSquare = (x, y, square) => {
  const { top, bottom, left, right } = square.getBoundingClientRect();
  return x >= left && x <= right && y >= top && y <= bottom;
};
  
export const getSquare = (x, y) => {
  return document.getElementById(`${x}-${y}`);
}

export const createHtmlPiece = (piece) => {
    const man = document.createElement('div');
    setPieceClasses(man, piece.colour, piece.isKing);
    man.addEventListener('mousedown', (e) => {
      if (piece.game.movingPlayer === piece.colour) {
        piece.handleDragStart(e, man);
      }
    });
    man.addEventListener('mousemove', (e) => piece.handleDrag(e, man));
    man.addEventListener('mouseup', (e) => piece.handleDragEnd(e, man));
    man.addEventListener('mouseout', (e) => piece.handleMouseOut(e, man))
    return man;
};

const setPieceClasses = (piece, colour, isKing) => {
    piece.classList.add('piece');
    piece.classList.add(`${colour}-piece`);
    if (isKing) {
      piece.classList.add(`${colour}-king`);
    }
  }

export const isOutOfBounds = (x, y) => {
    const outsideSpaces = [-1, -2, 8, 9];
    return outsideSpaces.includes(x) || outsideSpaces.includes(y);
  };
  
export const isOpenSpace = (x, y) => {
    if (isOutOfBounds(x, y)) {
      return false;
    }
    try {
      const square = getSquare(x, y);
    return square.children.length === 0;
    } catch (error) {
      console.log(x, y);
    }
    
  };