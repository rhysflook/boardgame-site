import { getCookie } from './utils';
export class GameSocket extends WebSocket {
    constructor(url, 
    // public game: GameState<T>,
    opponentColour) {
        super(url);
        this.url = url;
        this.opponentColour = opponentColour;
        this.addEventListener('open', this.setupGame);
        this.addEventListener('message', ({ data }) => this.handleMessage(data));
    }
    setupGame() {
        if (getCookie('player-1')) {
            const id = getCookie('id');
            this.send(JSON.stringify({ type: 'start', id: id }));
        }
        else {
            const opponent = getCookie('opponent');
            const event = { type: 'join', token: opponent };
            this.send(JSON.stringify(event));
        }
    }
    handleMessage(data) {
        const event = JSON.parse(data);
        const move = JSON.parse(event.content);
        // if (move.colour === this.opponentColour) {
        //   // window.setTimeout(
        //   //   () => this.game.handleOpponentMove(move.from, move.to, move.capturing),
        //   //   50
        //   // );
        // }
    }
}
