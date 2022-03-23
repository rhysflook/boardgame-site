import { DraughtMovesCalculator } from './DraughtMovesCalculator';
/*
■〇■　■　■
 ■　■　■〇■
■〇■〇■　■
 ■◎■　■〇■
■　■　■◎■
◎■◎■　■　■
■　■　■◎■
 ■　■　■　■
**/
describe('Tests for draught moves calculator', () => {
    const pieces = {
        blacks: [
            { pos: { x: 3, y: 6 }, colour: 'black', side: 'top', isKing: false },
            { pos: { x: 0, y: 1 }, colour: 'black', side: 'top', isKing: false },
            { pos: { x: 2, y: 1 }, colour: 'black', side: 'top', isKing: false },
            { pos: { x: 2, y: 3 }, colour: 'black', side: 'top', isKing: false },
            { pos: { x: 1, y: 6 }, colour: 'black', side: 'top', isKing: false },
        ],
        whites: [
            { pos: { x: 5, y: 0 }, colour: 'white', side: 'bottom', isKing: false },
            { pos: { x: 5, y: 2 }, colour: 'white', side: 'bottom', isKing: true },
            { pos: { x: 4, y: 5 }, colour: 'white', side: 'bottom', isKing: false },
            { pos: { x: 3, y: 2 }, colour: 'white', side: 'bottom', isKing: false },
            { pos: { x: 6, y: 5 }, colour: 'white', side: 'bottom', isKing: false },
            //   { pos: { x: 2, y: 5 }, colour: 'white', side: 'bottom', isKing: true },
        ],
    };
    const calculator = new DraughtMovesCalculator(pieces);
    test('correct number of moves and direction for bottom side piece', () => {
        const piece = pieces.whites[4];
        const moves = calculator.findMoves(piece);
        expect(moves.length).toEqual(2);
        expect(compareCoords(moves, 5, 4)).toBeTruthy();
        expect(compareCoords(moves, 5, 6)).toBeTruthy();
        expect(compareCoords(moves, 7, 4)).toBeFalsy();
        expect(compareCoords(moves, 7, 6)).toBeFalsy();
    });
    test('correct number of moves and direction for top side piece', () => {
        const piece = pieces.blacks[4];
        const moves = calculator.findMoves(piece);
        expect(moves.length).toEqual(2);
        expect(compareCoords(moves, 2, 5)).toBeTruthy();
        expect(compareCoords(moves, 2, 7)).toBeTruthy();
        expect(compareCoords(moves, 0, 5)).toBeFalsy();
        expect(compareCoords(moves, 0, 7)).toBeFalsy();
    });
    test('capture correctly detected for top side piece', () => {
        const piece = pieces.blacks[0];
        const moves = calculator.findCaptures(piece);
        expect(moves.length).toEqual(1);
        expect(moves[0].isCapture).toBeTruthy();
    });
    test('capture correctly detected for bottom side piece', () => {
        const piece = pieces.whites[3];
        const moves = calculator.findCaptures(piece);
        expect(moves.length).toEqual(2);
        expect(moves[0].isCapture).toBeTruthy();
        expect(moves[1].isCapture).toBeTruthy();
    });
    test('kinged piece can move in all directions', () => {
        const piece = pieces.whites[1];
        const moves = calculator.findMoves(piece);
        expect(moves.length).toEqual(4);
    });
    test('kinged piece can capture in all directions', () => {
        const newPieces = {
            blacks: [
                { pos: { x: 4, y: 5 }, colour: 'black', side: 'top', isKing: true },
            ],
            whites: [
                { pos: { x: 3, y: 4 }, colour: 'white', side: 'bottom', isKing: false },
                { pos: { x: 3, y: 6 }, colour: 'white', side: 'bottom', isKing: true },
                { pos: { x: 5, y: 4 }, colour: 'white', side: 'bottom', isKing: false },
                { pos: { x: 5, y: 6 }, colour: 'white', side: 'bottom', isKing: false },
            ],
        };
        const newCalculator = new DraughtMovesCalculator(newPieces);
        const piece = newPieces.blacks[0];
        const moves = newCalculator.findCaptures(piece);
        const spaces = newCalculator.getMoves(piece);
        spaces.forEach((space) => console.log(newCalculator.spaceAfterCapture(space[0], space[1], piece)));
        expect(moves.length).toEqual(4);
    });
    test('space after capture returns correct value', () => {
        const pieceOne = pieces.blacks[1];
        const pieceTwo = pieces.whites[3];
        const pieceThree = pieces.whites[4];
        expect(calculator.spaceAfterCapture(1, 2, pieceOne)).toEqual([2, 3]);
        expect(calculator.spaceAfterCapture(2, 1, pieceTwo)).toEqual([1, 0]);
        expect(calculator.spaceAfterCapture(5, 6, pieceThree)).toEqual([4, 7]);
    });
    test('calc returns no normal moves when captures available', () => {
        const moves = calculator.calc('blacks');
        console.log(moves);
        expect(moves.some((move) => move.isCapture === false)).toBeFalsy();
        expect(moves.some((move) => move.isCapture === true)).toBeTruthy();
    });
});
const compareCoords = (moves, expectedX, expectedY) => {
    return moves.some((move) => move.newPos.x === expectedX && move.newPos.y === expectedY);
};
