import React , { useState, useEffect, useContext } from 'react';
import UserStyle from './UserStyle';
import { useParams , useHistory } from 'react-router-dom';
import { StateContext } from '../../Front/Front';
import api , { prefixUrl } from '../../../actions/api';
import { Row , Col , Input , SelectPicker , Icon , InputGroup , Toggle } from 'rsuite';
import Photo from '../../../components/Photo/Photo';
import { alert , generateRandomString } from '../../../actions/Functions';

const User = () => {

    const { id } = useParams();
    const history = useHistory();
    const CONTEXT = useContext(StateContext);
    const [roles,setRoles] = useState(null);
    const [roleId,setRoleId] = useState(null);
    const [active,setActive] = useState(true);

    const [photo,setPhoto] = useState('');
    const [dataForm,setDataForm] = useState(null);
    const [showUserPassword,setShowUserPassword] = useState(false);

    const [nameError,setNameError] = useState(false);
    const [surnameError,setSurnameError] = useState(false);
    const [emailError,setEmailError] = useState(false);
    const [loginError,setLoginError] = useState(false);
    const [passwordError,setPasswordError] = useState(false);
    const [passwordConfirmedError,setPasswordConfirmedError] = useState(false);

    /*
     * Creating actions
     **/
    useEffect(() => {
        CONTEXT.setActions([
            {
                type: 'back',
                action: backAction
            },
            {
                type: 'save',
                label: id>0 ? 'Change' : 'Add user',
                action: saveData
            },
        ]);
    },[dataForm,roleId,active]);

    useEffect(() => {
        CONTEXT.setBread([{ label: 'Users', path: prefixUrl+"users" },{ label: id ? 'Edit user' : 'Adding a new user' }]);
        CONTEXT.setLoading(true);
        api('getUser/'+id,CONTEXT.userToken,{},r => {
            CONTEXT.setLoading(false);
            if (r.result){
                if (id>0) {
                    setDataForm({
                        name: r.data.user.name,
                        surname: r.data.user.surname,
                        email: r.data.user.email,
                        login: r.data.user.login
                    });
                    setPhoto(r.data.user.photo);
                    setActive(Boolean(r.data.user.active));
                } else {
                    setPhoto(r.data.photo);
                }
                setRoleId(r.data.roleId);
                setRoles(r.data.roles);
            }
        });
    },[]);

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

    const saveData = () => {
        api('saveUserSettings/'+id,CONTEXT.userToken,{...dataForm,...{ roleId, active: active | 0 }},r => {
            if (r.result){
                alert(r.comm,'success',5000);
                if (r.data.newId>0){
                    // hack to reload current component
                    const currentPath = prefixUrl+"users/"+r.data.newId;
                    history.replace(`${currentPath}/replace`);
                    history.replace(currentPath)
                }
            } else {
                if (r.errors!==undefined){
                    r.errors.forEach(element => {
                        if (element.indexOf('The name')>=0) setNameError(true);
                        if (element.indexOf('The surname')>=0) setSurnameError(true);
                        if (element.indexOf('e-mail')>=0) setEmailError(true);
                        if (element.indexOf('login')>=0) setLoginError(true);
                        if (element.indexOf('password must')>=0 || element.indexOf('password field')>=0) setPasswordError(true);
                        if (element.indexOf('password confirmation')>=0) setPasswordConfirmedError(true);
                    });
                }
                alert(r.comm,'error');
            }
        });
    }

    const generatePassword = event => {
        event.preventDefault();
        const newPassword = generateRandomString();
        updateDataState([{ password: newPassword },{ password_confirmation: newPassword }]);
    }

    const backAction = () => {
        history.push(prefixUrl+"users");
    }

    return (
        <UserStyle>
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md={12} className={nameError ? 'error' : ''}>
                            <label>Name</label>
                            <Input value={dataForm?.name || ''} onChange={v => updateDataState('name',v)} placeholder="Name" onFocus={() => setNameError(false)} />
                        </Col>
                        <Col md={12} className={surnameError ? 'error' : ''}>
                        <label>Surname</label>
                            <Input value={dataForm?.surname || ''} onChange={v => updateDataState('surname',v)} placeholder="Surname" onFocus={() => setSurnameError(false)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className={emailError ? 'error' : ''}>
                            <label>E-mail</label>
                            <Input value={dataForm?.email || ''} onChange={v => updateDataState('email',v)} placeholder="E-mail" onFocus={() => setEmailError(false)} />
                        </Col>
                        <Col md={12}>
                            <label className="toggle">Active</label>
                            <Toggle checked={active} onChange={v => setActive(v)} className="active" />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={24}>
                            <label>Avatar</label>
                            <Photo 
                                photo={photo}
                                setPhoto={setPhoto}
                                CONTEXT={CONTEXT}
                                // saveData={saveDataPhoto}
                                urlAppend={'uploadPhotoUser/'+id}
                                urlRemove={'removePhotoUser/'+id}
                                height={175}
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
                                <label>Password <a href="" title="Generate a password" onClick={ev => generatePassword(ev)}><Icon icon="cog" /></a></label>
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
                                <label>Repeat password</label>
                                <Input type="password" value={dataForm?.password_confirmation || ''} onChange={v => updateDataState('password_confirmation',v)} onFocus={() => setPasswordConfirmedError(false)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={24}>
                                <label>Rola</label>
                                {roles!=null &&
                                    <SelectPicker 
                                        searchable={false} 
                                        cleanable={false} 
                                        placeholder="Select a role for the user" 
                                        value={roleId}
                                        placement="topStart" 
                                        onChange={el => {
                                            setRoleId(el);
                                        }} 
                                        data={roles.map(el => {
                                            return { label: el.name, value: el.id }
                                        })}
                                    />
                                }
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </UserStyle>
    );
}
export default User;