import React from 'react';
import { Switch , Route } from 'react-router-dom';
import { prefixUrl } from '../actions/api';
import Login from '../Pages/StartPage/Login/Login';
import Forget from '../Pages/StartPage/Forget/Forget';
import ChangePassword from '../Pages/StartPage/ChangePassword/ChangePassword';

const RoutingLogin = ({ state, dispatch }) => {
    return (
        <>
            <Switch>
                <Route exact path={prefixUrl+"login"}>
                    <Login dispatch={dispatch} />
                </Route>
                <Route exact path={prefixUrl+"forget"}>
                    <Forget dispatch={dispatch} />
                </Route>
                <Route exact path={prefixUrl+"changePassword/:token"}>
                    <ChangePassword state={state} dispatch={dispatch} />
                </Route>
            </Switch>
        </>
    )
}

export default RoutingLogin;