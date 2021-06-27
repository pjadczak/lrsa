import React , { useState, useEffect , useRef, useReducer } from 'react';
import FrontStyle from './FrontStyle';
import LeftPanel from './LeftPanel/LeftPanel'; 
import TopPanel from './TopPanel/TopPanel';
import BodyPanel from './BodyPanel/BodyPanel';
import TopPanelStatus from './TopPanelStatus/TopPanelStatus'; 
import api ,{ prefixUrl , pathLogout } from '../../actions/api';
import localStorage from '../../actions/ls';
import { useHistory } from 'react-router-dom';
import IdleTimer from 'react-idle-timer'
import IddleLogin from '../IddleLogin/IddleLogin';
import Store from '../../Store/Store';

export const StateContext = React.createContext({});

const defaultSettings = {
    idle: 1,
    idle_time: 900
}

const Front = ({ state, dispatch }) => {

    const history = useHistory();
    const idleRef = useRef();
    // const [path,setPath] = useState(history.location.pathname);
    const [loading,setLoading] = useState(false);
    
    const readData = () => {
        api('getBaseData',state.userToken,{},r => {
            if (r.result){
                dispatch({ type: 'SAVE_BASE_DATA', data: r.data })
            }
        });
    }

    useEffect(() => {
        if (!state.idle){
            const listenHistory = history.listen(data => {
                dispatch({ type: 'PATH', data: data.pathname });
            });
            readData();
            const interval = setInterval(() => {
                readData();
            },30000);

            return () => {
                clearInterval(interval);
                listenHistory();
            }
        }
    },[state.idle]);

    useEffect(() => {
        if (state.idle){
            api('idleLogout',state.userToken,{},r => {
                if (r.result){
                    dispatch({ type: 'IDDLE_LOGOUT', idleToken: r.data.token });
                }
            });
        } else {
            dispatch({ type: 'IDLE_SHOW', data: false });
        }
    },[state.idle]);

    /*
     * Detect hange path
     **/
    useEffect(() => {
        if (state.path === pathLogout){
            api('logout',state.userToken,{},r => {
                dispatch({ type: 'LOGOUT' });
            });
            
        }
    },[state.path]);

    const setBread = data => {
        dispatch({ type: 'SET_BREAD', data })
    }

    const setActions = data => {
        dispatch({ type: 'SET_ACTIONS', data })
    }

    return (
        <StateContext.Provider value={{...state,...{ dispatch , setBread, setActions, setLoading }}}>
            
            {state.settings.idle &&
                <>
                    <IdleTimer
                        ref={ref => idleRef }
                        timeout={Number(state.settings.idle_time)*1000}
                        onIdle={() => dispatch({ type: 'IDLE', data: true })}
                        debounce={250}
                    />
                    {state?.showIddleLogin && 
                        <IddleLogin 
                            dispatch={dispatch}
                            state={state}
                            token={state?.idleToken} 
                        />
                    }
                </>
            }
           
            <FrontStyle id="frontLayer">
                <div className="leftPanel">
                    <LeftPanel state={state} />
                </div>
                <div className="rightPanel">
                    <TopPanel state={state} dispatch={dispatch} />
                    <TopPanelStatus actions={state.actions} bread={state.bread} loading={loading} />
                    <BodyPanel />
                </div>
            </FrontStyle>
        </StateContext.Provider>
    );
}
export default Front;