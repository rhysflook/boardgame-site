export class DraughtRules {
    handleCapture(pieces, move) {
        const { enemyX, enemyY } = this.findCapturedPiece(move);
        const square = document.getElementById(`${enemyX}-${enemyY}`);
        square.innerHTML = '';
        return { x: enemyX, y: enemyY };
    }
    findCapturedPiece(move) {
        const enemyX = move.pos.x - move.newPos.x < 0 ? move.pos.x + 1 : move.pos.x - 1;
        const enemyY = move.pos.y - move.newPos.y < 0 ? move.pos.y + 1 : move.pos.y - 1;
        return { enemyX, enemyY };
    }
}
