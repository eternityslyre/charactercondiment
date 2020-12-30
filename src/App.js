import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { TicTacToe } from './Game';
import { TicTacToeBoard } from './Board';

const TTTClient = Client({
    game: TicTacToe,
    board: TicTacToeBoard,
    multiplayer: Local(),
});

const App = () => (
    <div>
        {/* <TTTClient /> */}
        <TTTClient playerID="0" />
        <TTTClient playerID="1" />
    </div>
);

export default App;
