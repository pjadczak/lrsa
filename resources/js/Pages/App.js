import React , { useState, useEffect, useReducer } from 'react';
import localStorage from '../actions/ls';
import { BrowserRouter as Router } from "react-router-dom";
import { prefixUrl , baseUrl } from '../actions/api';
import { GlobalStyle } from '../Styles/GlobalStyle';
import RoutingLogin from '../Routing/RoutingLogin';
import { Loader } from 'rsuite';
import logo from '../assets/images/logo.png';
import Front from './Front/Front';
import Store from '../Store/Store';

const defaultState = {
    isLogged: false,
    userData: null,
    userToken: '',
    reloadLocalStorage: 0,
    loadingLogin: false,
    forms: [],
    lastLogs: [],
    bread: null,
    actions: null,
    settings: { idle: 1, idle_time: 900 },
    path: ''
}

const App = () => {

    const [state,dispatch] = useReducer(Store,defaultState);

    useEffect(() => {

        const userDataTemp = localStorage.get('userData');
        const userTokenTemp = localStorage.get('userToken');
        if (userDataTemp!==null && userTokenTemp!==undefined && userTokenTemp!==null){
            dispatch({ type: 'SET_USER_FULL_DATA', userData: userDataTemp, userToken: userTokenTemp });
        } else {
            if (userDataTemp!==null){
                localStorage.clear('userData');
            }
            if (!state.isLogged && window.location.pathname!=prefixUrl+'register' && window.location.pathname!=prefixUrl+'forget' && window.location.pathname.indexOf(prefixUrl+'login')<0 && window.location.pathname.indexOf(prefixUrl+'activate')<0 && window.location.pathname.indexOf(prefixUrl+'changePassword')<0){
                window.location.href=prefixUrl+'login';
            }
        }

    },[state.reloadLocalStorage]);

    return (
        <Router>
            <div id="boxLayout" className={(!state.isLogged ? 'boxLayoutNotLogged' : '')}>
                <GlobalStyle isLogged={state.isLogged} />
                {state.loadingLogin && <Loader size="md" className="loaderLogin" />}
                {!state.isLogged && 
                    <>
                        <div className="logoStart"><img src={logo} /></div>
                        <RoutingLogin state={state} dispatch={dispatch} />
                    </>
                }
                {state.isLogged && 
                    <>
                        <Front state={state} dispatch={dispatch} />
                    </>
                }
            </div>
        </Router>
    );
}
export default App;