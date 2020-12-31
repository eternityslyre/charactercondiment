import Home from './Home';
import Room from './Room';
import { Route, Switch, Redirect, useHistory } from "react-router-dom";

const App = () => {
    const history = useHistory();

    return <Switch>
        <Route exact path="/">
            <Home history={history} />
        </Route>
        <Route exact path="/rooms/:id">
            <Room history={history} />
        </Route>
        <Redirect to="/" />
    </Switch>
};

export default App;
