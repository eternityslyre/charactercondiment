import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { TicTacToe } from './Game';
import { TicTacToeBoard } from './Board';
import Home from './Home';
import Room from './Room';
import { Route, Switch, Redirect, useHistory } from "react-router-dom";

const TTTClient = Client({
    game: TicTacToe,
    board: TicTacToeBoard,
    multiplayer: Local(),
});



const App = () => {
    const history = useHistory();

    return <Switch>
            <Route exact path="/rooms/:id">
                <Room history={history} />
            </Route>
            <Route exact path="/">
                <div>
                    {/* <TTTClient /> */}
                    <TTTClient playerID="0" />
                    <TTTClient playerID="1" />
                </div>
            </Route>
            <Route exact path="/test">
                <Home history={history} />
            </Route>
            
            <Redirect to="/" />
        </Switch>
};

export default App;
