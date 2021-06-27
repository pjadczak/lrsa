import React , { useState, useEffect, useContext } from 'react';
import IddleLoginStyle from './IddleLoginStyle';
import { Row, Col, Input , InputGroup , Icon , Button } from 'rsuite';
import api , { urlPhotos , baseUrl } from '../../actions/api';
import { useHistory } from 'react-router-dom';
import ls from '../../actions/ls';
import { alert } from '../../actions/Functions';

const IddleLogin = ({ dispatch, token, state }) => {

    const history = useHistory();
    const [password,setPassword] = useState('');
    const [passwordShow,setPasswordShow] = useState(false);
    const [loading,setLoading] = useState(false);

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    }

    const login = () => {
        setLoading(true);
        api('setLoginFromIdle','',{ password, login: state.userData.login , token },r => {
            setLoading(false);
            if (r.result){
                dispatch({ type: 'SET_USER_FULL_DATA', userData: r.data.userData, userToken: r.data.token });
                dispatch({ type: 'IDLE', data: false });
                dispatch({ type: 'RELOAD_LOCAL_STORAGE' });
            } else {
                alert(r.comm,'error');
            }
        });
    }

    return (
        <IddleLoginStyle>
            <div className={"box"+(loading ? ' loadingLayer' : '')}>
                <header>Please type Your <strong>Password</strong></header>
                <Row>
                    <Col>
                        {state.userData.photo!=='' &&
                            <div className="photo"><img src={urlPhotos+"small/"+state.userData.photo} /></div>
                        }
                        <label>{state.userData.name} {state.userData.surname}<span>{state.userData.role}</span></label>
                        <InputGroup>
                            <Input value={password} onChange={text => setPassword(text)} type={passwordShow ? 'text' : 'password'} onKeyDown={event => {
                                    if (event.keyCode==13){
                                        login();
                                    }
                                }} 
                            />
                            <InputGroup.Button onClick={() => setPasswordShow(v => !v)} >
                                <Icon icon="eye" />
                            </InputGroup.Button>
                        </InputGroup>
                        <div className="buttons">
                            <Button appearance="primary" onClick={() => login()}><Icon icon="sign-in" /> Confirm</Button>
                            <Button className="logout" onClick={() => logout()}><Icon icon="sign-out" /> Logout</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </IddleLoginStyle>
    );
}
export default IddleLogin;