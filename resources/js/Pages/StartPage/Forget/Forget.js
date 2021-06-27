import React , { useEffect , useState } from 'react';
import api , { prefixUrl } from '../../../actions/api';
import { BoxLogin } from '../../../Styles/StartPageStyle';
import { Loader } from 'rsuite';
import { Input, InputGroup, Row, Icon , Button } from 'rsuite';
import { sn } from '../../../actions/Functions';
import { useHistory } from 'react-router-dom';

const Forget = ({ dispatch }) => {

    const [login,setLogin] = useState('');
    const [errLogin,setErrLogin] = useState(false);
    const [result,setResult] = useState(false);
    const [resultText,setResultText] = useState('');
    const history = useHistory();

    useEffect(() => {
        if (errLogin){
            setTimeout(() => setErrLogin(false),3500);
        }
    },[errLogin]);

    const handleForget = () => {
        if (login.length<5){
            setErrLogin(true);
        } else {
            dispatch({ type: 'LOADIN_LOGIN', data: true });
            api('forgetPassword','',{ login } ,r => {
                dispatch({ type: 'LOADIN_LOGIN', data: false });
                if (r.result){
                    setResult(true);
                    setResultText(r.comm);
                    setTimeout(() => {
                        history.push(prefixUrl+'login');
                    },10000);
                } else {
                    setErrLogin(true);
                    sn('Zmiana hasła',r.comm);
                }
            });
        }
    }

    const handleBack = () => {
        history.push(prefixUrl+'login');
    }

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
        <>
            <BoxLogin>
                <div className="box box-lone">
                    <header>Password change</header>
                    <div className={"content"}>
                        <p>To change your password, enter your <strong>e-mail</strong> address or <strong>login</strong></p>
                    </div>
                    <Row className={"rowBox rowBoxMargin"+(errLogin ? ' rowError' : '')}>
                        <Input 
                            value={login} 
                            onKeyUp={e => { if (e.keyCode==13) handleForget() }}
                            onFocus={() => setErrLogin(false)} 
                            onChange={v => setLogin(v)} 
                        />
                    </Row>
                    <Row className="rowButtons">
                        <Button color="blue" className="button button-back" onClick={handleBack}>
                            Back
                        </Button>
                        <Button color="green" className="button button-action" onClick={handleForget}>
                            Change password
                        </Button>
                    </Row>
                </div>
            </BoxLogin>
        </>
    )
}

export default Forget;