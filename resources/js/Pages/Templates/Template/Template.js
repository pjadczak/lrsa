import React, { useState, useEffect , useContext } from 'react';
import { Row, Col , Button , SelectPicker, Input , Modal } from 'rsuite';
import TemplateStyle from './TemplateStyle';
import { useHistory , useParams } from "react-router-dom";
import { StateContext } from '../../Front/Front';
import api , { prefixUrl } from '../../../actions/api';
import Photo from '../../../components/Photo/Photo';
import Editor from '../../../components/Editor/Editor';
import { alert } from '../../../actions/Functions';

const Template = () => {
    const CONTEXT = useContext(StateContext);
    const history = useHistory();
    const { id , s } = useParams();

    const [photo,setPhoto] = useState('');
    const [content,setContent] = useState('');
    const [name,setName] = useState('');
    const [headers,setHeaders] = useState([]);
    const [typeId,setTypeId] = useState(null);
    const [typeData,setTypeData] = useState(null);
    const [variables,setVariables] = useState([]);
    const [email,setEmail] = useState();
    const [showModalTest,setShowModalTest] = useState(false);
    const [dataReadyDone,setDataReadyDone] = useState(false);
    const [dataStart,setDataStart] = useState(null);// trzymamy dane wczytane dla startu strony
    const [changed,setChanged] = useState(false);

    const [errName,setErrName] = useState(false);
    const [errContent,setErrContent] = useState(false);
    const [errType,setErrType] = useState(false);

    useEffect(() => {
        CONTEXT.setBread([{ label: 'Email templates', path: prefixUrl+'templates' },{ label: id>0 ? 'Editing the template' : 'Adding a new template' } ]);
        setEmail(CONTEXT.userData.email);
        if (s!='' && s!==undefined) setSearch(s);
        CONTEXT.setLoading(true);
        api('getTemplate/'+id,CONTEXT.userToken,{},r => {
            CONTEXT.setLoading(false);
            if (r.data.template!==null){
                setName(r.data.template.name);
                setContent(r.data.template.content);
                setTypeId(r.data.template.template_type_id);
                setPhoto(r.data.template.photo);
            } else {
                if (r.data.photo!=''){
                    setPhoto(r.data.photo);
                }
            }
            setHeaders(v => {
                setDataReadyDone(true);
                return r.data.headers;
            });
        });
        if (CONTEXT.userData.role!=='root'){
            history.push("/");
        }
    },[]);

    // console.log(content);

    useEffect(() => {
        const dataActions = [
            {
                type: 'back',
                action: () => history.push(prefixUrl+"templates")
            },
        ];
        if (id && !changed){
            dataActions.push({
                type: 'other',
                label: 'Send a test message',
                action: () => setShowModalTest(true)
            });
        }
        dataActions.push({
            type: 'change',
            label: id>0 ? 'save Changes' : 'Add a template',
            action: changeAction
        });
        CONTEXT.setActions(dataActions);
    },[id,content,name,typeId,changed,email]);

    useEffect(() => {
        if (dataReadyDone){
            setDataStart(getSendData());
        }
    },[dataReadyDone]);

    useEffect(() => {
        if (dataReadyDone){
            const data = getSendData();
            if (data!==dataStart){
                setChanged(true);
            }
        }
    },[name,photo,content]);

    const getSendData = () => {
        return {
            name,
            photo,
            content
        }
    }

    useEffect(() => {
        if (typeId!==null && headers.length>0){
            const _typeData = headers.find(el => el.id==typeId);
            setTypeData(_typeData);
            setVariables(_typeData.variables.split(','));
        }
    },[typeId,headers]);

    const changeAction = () => {
        const dataSave = {
            name,
            content,
            typeId
        }
        CONTEXT.setLoading(true);
        api('saveTemplate/'+id,CONTEXT.userToken,dataSave,r => {
            CONTEXT.setLoading(false);
            if (r.result){
                setChanged(false);
                alert(r.data.comm,'success');
                if (r.data.newId){
                    // hack to reload current component
                    const currentPath = prefixUrl+"templates/"+r.data.newId;
                    history.replace(`${currentPath}/replace`);
                    history.replace(currentPath)
                }
            } else {
                alert(r.comm,'error');
                if (r.errors!==undefined){
                    r.errors.forEach(el => {
                        if (el.indexOf('name field')>=0) setErrName(true);
                        if (el.indexOf('content field')>=0) setErrContent(true);
                        if (el.indexOf('type of')>=0) setErrType(true);
                    });
                }
            }
        });
    }

    const sendTest = () => {
        setShowModalTest(false);
        CONTEXT.setLoading(true);
        api('testSendEmailTempate',CONTEXT.userToken,{ id, email },r => {
            CONTEXT.setLoading(false);
            if (r.result){
                alert(r.data.comm,'success');
            } else {
                alert(r.comm,'error');
            }
        });
    }

    return (
        <TemplateStyle>
            <div className="body">
                <Row>
                    <Col md={16}>
                        <Row style={{ marginBottom: 20 }}>
                            <Col md={24}>
                                <label>Header graphic</label>
                                <Photo 
                                    disabled={false}
                                    height={100}
                                    photo={photo}
                                    setPhoto={setPhoto}
                                    CONTEXT={CONTEXT}
                                    urlAppend={'changeTemplatePhoto/'+id}
                                    urlRemove={'removeTemplatePhoto/'+id}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={24} className={errContent ? 'error' : ''}>
                                <label>
                                    Message content
                                </label>
                                <Editor content={content} setContent={setContent} height={210} onFocusHandler={() => setErrContent(false)} />
                                    <Row>
                                        <Col md={12}>
                                            <>
                                                <br />
                                                Variables used in the template:
                                                {variables.some(el => el!='') &&
                                                    <ul>
                                                        {variables.map((el,index) => <li key={`li_variables_${index}`}><strong>%{el}%</strong></li>)}
                                                    </ul>
                                                }
                                                {!variables.some(el => el!='') &&
                                                    <>-- lack --</>
                                                }
                                            </>
                                        </Col>
                                    </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={8}>
                        <Row style={{ marginBottom: 20 }}>
                            <Col md={24} className={errName ? 'error' : ''}>
                                <label>The title of the message</label>
                                <Input value={name} onChange={text => setName(text)} onFocus={() => setErrName(false)} />
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 20 }}>
                            <Col md={24} className={errType ? 'error' : ''}>
                                <label>Type</label>
                                <SelectPicker 
                                    searchable={false} 
                                    cleanable={false}
                                    disabled={id>0} 
                                    value={typeId} 
                                    onChange={v => setTypeId(v)} data={headers.map(el => {
                                        return { value: el.id, label: el.name }
                                    })} 
                                    onOpen={() => setErrType(false)} 
                                />
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </div>
            <Modal 
                show={showModalTest}
                onHide={() => setShowModalTest(false)}
            >
                <Modal.Header>
                    <Modal.Title>Send to address - email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        A test email will be sent to <strong> {email} </strong>. The variables will be completed with test data. Some of the data is random, such as numerical values or gender. If the e-mail did not arrive, check the <strong> SPAM </strong> folder
                    </p>
                    <br />
                    <Input value={email} onChange={text => setEmail(text)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => sendTest()} appearance="primary">
                        Send
                    </Button>
                    <Button onClick={() => setShowModalTest(false)} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </TemplateStyle>
    )
}

export default Template;