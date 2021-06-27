import React , { useState, useEffect, useContext } from 'react';
import ProfileStyle from './ProfileStyle';
import { Row, Col, Input , Icon , InputGroup } from 'rsuite';
import api from '../../actions/api';
import { StateContext } from '../Front/Front';
import Photo from '../../components/Photo/Photo';
import { alert , generateRandomString } from '../../actions/Functions';

const Profile = () => {

    const CONTEXT = useContext(StateContext);
    const [photo,setPhoto] = useState(CONTEXT.userData.photo);
    const [dataForm,setDataForm] = useState(null);

    const [nameError,setNameError] = useState(false);
    const [surnameError,setSurnameError] = useState(false);
    const [emailError,setEmailError] = useState(false);
    const [loginError,setLoginError] = useState(false);
    const [passwordError,setPasswordError] = useState(false);
    const [passwordConfirmedError,setPasswordConfirmedError] = useState(false);
    const [showUserPassword,setShowUserPassword] = useState(false);

    // Update form data
    const updateDataState = (field,value = null ) => {
        let addValue = {};
        if (Array.isArray(field)){
            field.forEach(obj => {
                addValue = { ...addValue, ...obj } 
            });
        } else {
            addValue = { [field]: value };
        }
        setDataForm({...dataForm,...addValue});
    }

    useEffect(() => {
        setDataForm({
            name: CONTEXT.userData.name,
            surname: CONTEXT.userData.surname,
            email: CONTEXT.userData.email,
            login: CONTEXT.userData.login,
            password: '',
            password_confirmation: ''
        });
        if (CONTEXT.userData.photo!=''){
            setPhoto(CONTEXT.userData.photo);
        }
        
        CONTEXT.setBread([{ label: 'Profil' }]);
    },[]);

    /*
     * Creating actions
     **/
    useEffect(() => {
        CONTEXT.setActions([{
            type: 'save',
            label: 'Zapisz ustawienia',
            action: saveProfile
        }]);
    },[dataForm]);

    const generatePassword = event => {
        event.preventDefault();
        const newPassword = generateRandomString();
        updateDataState([{ password: newPassword },{ password_confirmation: newPassword }]);
    }

    const saveProfile = () => {
        CONTEXT.setLoading(true);
        api('saveDataProfile',CONTEXT.userToken,dataForm,r => {
            CONTEXT.setLoading(false);
            if (r.result){
                CONTEXT.dispatch({ type: 'SET_USER_DATA', data: r.data.userData })
                alert(r.comm,'success');
            } else {
                if (r.errors!==undefined){
                    r.errors.forEach(element => {
                        if (element.indexOf('The name')>=0) setNameError(true);
                        if (element.indexOf('The surname')>=0) setSurnameError(true);
                        if (element.indexOf('e-mail')>=0) setEmailError(true);
                        if (element.indexOf('login')>=0) setLoginError(true);
                        if (element.indexOf('password must')>=0) setPasswordError(true);
                        if (element.indexOf('password confirmation')>=0) setPasswordConfirmedError(true);
                    });
                }
                alert(r.comm,'error');
            }
        });
    };

    return (
        <ProfileStyle>
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md={12} className={nameError ? 'error' : ''}>
                            <label>Imię</label>
                            <Input value={dataForm?.name || ''} onChange={v => updateDataState('name',v)} placeholder="Imię" onFocus={() => setNameError(false)} />
                        </Col>
                        <Col md={12} className={surnameError ? 'error' : ''}>
                        <label>Nazwisko</label>
                            <Input value={dataForm?.surname || ''} onChange={v => updateDataState('surname',v)} placeholder="Nazwisko" onFocus={() => setSurnameError(false)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={24} className={emailError ? 'error' : ''}>
                            <label>E-mail</label>
                            <Input value={dataForm?.email || ''} onChange={v => updateDataState('email',v)} placeholder="E-mail" onFocus={() => setEmailError(false)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={24}>
                            <label>Avatar</label>
                            <Photo 
                                photo={photo}
                                setPhoto={setPhoto}
                                CONTEXT={CONTEXT}
                                saveData={data => CONTEXT.dispatch({ type: 'SET_USER_DATA', data })}
                                urlAppend={'uploadPhotoProfile'}
                                urlRemove={'removePhotoProfile'}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col md={12}>
                    <div className="loginData">
                        <Row>
                            <Col md={24} className={loginError ? 'error' : ''}>
                                <label>Login</label>
                                <Input value={dataForm?.login || ''} onChange={v => updateDataState('login',v)} onFocus={() => setLoginError(false)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={24} className={passwordError ? 'error' : ''}>
                                <label>Hasło <a href="" title="Wygeneruj hasło" onClick={ev => generatePassword(ev)}><Icon icon="cog" /></a></label>
                                <InputGroup>
                                <Input type={showUserPassword ? 'text' : 'password'} value={dataForm?.password || ''} onChange={v => updateDataState('password',v)} onFocus={() => setPasswordError(false)} />
                                    <InputGroup.Button onClick={() => setShowUserPassword(v => !v)}>
                                        <Icon icon="eye" />
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={24} className={passwordConfirmedError ? 'error' : ''}>
                                <label>Powtórz hasło</label>
                                <Input type="password" value={dataForm?.password_confirmation || ''} onChange={v => updateDataState('password_confirmation',v)} onFocus={() => setPasswordConfirmedError(false)} />
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </ProfileStyle>
    );
}
export default Profile;