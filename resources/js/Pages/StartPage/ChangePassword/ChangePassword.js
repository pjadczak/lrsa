import React , { useState , useEffect } from 'react';
import { BoxLogin } from '../../../Styles/StartPageStyle';
import { Input, InputGroup, Row , Icon , Button , Col } from 'rsuite';
import api, { prefixUrl } from '../../../actions/api';
import { defaultPage } from '../../../actions/variables';
import { Link , useParams , useHistory } from "react-router-dom";
import { sn } from '../../../actions/Functions';
import localStorage from '../../../actions/ls';

const ChangePassword = ({ dispatch }) => {

    const { token } = useParams();
    const [password,setPassword] = useState('');
    const [password2,setPassword2] = useState('');
    const [errPassword2,setErrPassword2] = useState(false);
    const [errPassword,setErrPassword] = useState(false);
    const [result,setResult] = useState(false);
    const [resultText,setResultText] = useState(true);
    const history = useHistory();

    const handleChange = () => {

        let err = false;
        if (password.length<8){
            err = true;
            setErrPassword(true);
            sn('Password change','Enter the password correctly','error');
        } else if (password!=password2){
            err = true;
            setErrPassword2(true);
            sn('Password change','Both passwords are different','error');
        } else {
            dispatch({ type: 'LOADIN_LOGIN', data: true });
            api('changePassword','',{ token, password, password_confirmation: password2 } ,r => {
                dispatch({ type: 'LOADIN_LOGIN', data: false });
                if (r.result){
                    setResult(true);

                    dispatch({ type: 'SET_USER_FULL_DATA', userData: r.data.userData, userToken: r.data.token });
                    setResultText('Your password has been changed and you will be logged in automatically.');

                    setTimeout(() => {
                        // setIsLogged(true);
                        history.push(prefixUrl+defaultPage);
                    },5000);

                } else {
                    sn('Password change',r.comm,'error');
                    if (r.errors!==undefined && r.errors!==null){
                        r.errors.forEach(el => {
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
        
    }

    useEffect(() => {
        if (errPassword){
            setTimeout(() => setErrPassword(false),3500);
        }
        if (errPassword2){
            setTimeout(() => setErrPassword2(false),3500);
        }
    },[errPassword,errPassword2]);

    if (result){
        return (
            <BoxLogin>
                <div className="boxSuccess">
                    <header>Password change</header>
                    {resultText}
                </div>
            </BoxLogin>
        )
    }

    return (
        <BoxLogin>
            <div className="box box-lone">
                <header>Change Password</header>
                <div className="content">Enter the new password correctly, remember that the password must have at least 8 characters and have one uppercase letter, special character and number</div>
                <Row className={"rowBox rowBoxMargin"+(errPassword ? ' rowError' : '')}>
                    <Col md={8} className="colLabelInput">
                        Password
                    </Col>
                    <Col md={16}>
                        <InputGroup inside>
                            <Input 
                                type="password"
                                value={password} 
                                onKeyUp={e => { if (e.keyCode==13) handleChange() }} 
                                onFocus={() => setErrPassword2(false)} 
                                onChange={v => setPassword(v)} 
                            />
                            <InputGroup.Button>
                                <Icon icon="question-circle" onClick={() => sn('Log in','The password should contain lowercase characters, at least one special character, one uppercase letter and one number.')} />
                            </InputGroup.Button>
                        </InputGroup>
                    </Col>
                </Row>
                <Row className={"rowBox rowBoxMargin"+(errPassword2 ? ' rowError' : '')}>
                    <Col md={8} className="colLabelInput">
                        Repeat password
                    </Col>
                    <Col md={16}>
                        <InputGroup inside>
                            <Input 
                                type="password"
                                value={password2} 
                                onKeyUp={e => { if (e.keyCode==13) handleChange() }} 
                                onFocus={() => setErrPassword2(false)} 
                                onChange={v => setPassword2(v)} 
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row className="rowButtons">
                    <Link to="/login" className="forget">Back to the login page</Link>
                    <Button color="green" className="button button-action" onClick={handleChange}>
                        Change Password
                    </Button>
                </Row>
            </div>
        </BoxLogin>
    )
}

export default ChangePassword;