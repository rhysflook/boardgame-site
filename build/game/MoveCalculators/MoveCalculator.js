export class MoveCalculator {
    constructor(pieces) {
        this.pieces = pieces;
        this.allPieces = [...this.pieces.blacks, ...this.pieces.whites];
    }
}
