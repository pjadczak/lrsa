import React , { useState , useEffect } from 'react';
import { BoxLogin } from '../../../Styles/StartPageStyle';
import { Input, InputGroup, Row , Icon , Button } from 'rsuite';
import api , { prefixUrl } from '../../../actions/api';
import { Link , useHistory } from "react-router-dom";
import { alert, sn } from '../../../actions/Functions';
import localStorage from '../../../actions/ls';
import { defaultPage } from '../../../actions/variables';

const Login = ({ dispatch }) => {

    const history = useHistory();
    const [login,setLogin] = useState('');
    const [password,setPassword] = useState('');
    const [errLogin,setErrLogin] = useState(false);
    const [errPassword,setErrPassword] = useState(false);
    const [loading,setLoading] = useState(false);

    const loginAction = (userData,token) => {
        localStorage.add('userData', userData);
        localStorage.add('userToken', token);

        dispatch({ type: 'RELOAD_LOCAL_STORAGE' });
        history.push(prefixUrl+defaultPage);
    }

    const handleLogin = () => {
        dispatch({ type: "LOADIN_LOGIN", data: true });
        api('login','',{ email: login, password } ,r => {
            dispatch({ type: "LOADIN_LOGIN", data: false });
            if (r.result){
                loginAction(r.data.userData,r.data.token);
            } else {
                sn('Logowanie',r.comm,'error');
                if (r.errors!==undefined && r.errors!==null){
                    r.errors.forEach(el => {
                        if (el.indexOf('The email')>=0){
                            setErrLogin(true);
                        }
                        if (el.indexOf('The password')>=0){
                            setErrPassword(true);
                        }
                    });
                } else if (r.errCode!==null && r.errCode==2){
                    setErrPassword(true);
                }
            }
        });
    }

    useEffect(() => {
        if (errLogin){
            setTimeout(() => setErrLogin(false),3500);
        }
        if (errPassword){
            setTimeout(() => setErrPassword(false),3500);
        }
    },[errLogin,errPassword]);

    return (
        <BoxLogin>
            <div className="tab">
                <ul>
                    <li><Link to={prefixUrl+"login"} className="selected">Sign in</Link></li>
                </ul>
            </div>
            <div className="box">
                <Row className={"rowBox rowBoxMargin"+(errLogin ? ' rowError' : '')}>
                    <InputGroup inside>
                        <Input 
                            placeholder={"Login or e-mail adress"} 
                            value={login} 
                            onKeyUp={e => { if (e.keyCode==13) handleLogin() }} 
                            onFocus={() => setErrLogin(false)} 
                            onChange={v => setLogin(v)} 
                        />
                        <InputGroup.Button>
                            <Icon icon="question-circle" onClick={() => sn('Logowanie','Enter your login or e-mail address')} />
                        </InputGroup.Button>
                    </InputGroup>
                </Row>
                <Row className={"rowBox rowBoxMargin"+(errPassword ? ' rowError' : '')}>
                    <InputGroup inside>
                        <Input 
                            type="password" 
                            placeholder={"Password"} 
                            value={password} 
                            onKeyUp={e => { if (e.keyCode==13) handleLogin() }}
                            onFocus={() => setErrPassword(false)} 
                            onChange={v => setPassword(v)} 
                        />
                        <InputGroup.Button>
                            <Icon icon="question-circle" onClick={() => sn('Logowanie','Enter your account password correctly')} />
                        </InputGroup.Button>
                    </InputGroup>
                </Row>
                <Row className="rowButtons">
                    <Link to={prefixUrl+"forget"} className="forget">I forgot my password</Link>
                    <Button disabled={!(login.length>=3 && password.length>=3)} color="green" className="button button-action" onClick={handleLogin}>
                        Sign In
                    </Button>
                </Row>
            </div>
        </BoxLogin>
    )
}

export default Login;