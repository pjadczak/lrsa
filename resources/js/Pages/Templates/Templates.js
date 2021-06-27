import React, { useState, useEffect , useContext } from 'react';
import { StateContext } from '../Front/Front';
import TemplatesStyle from './TemplatesStyle';
import { Row, Col } from 'rsuite';
import api , { prefixUrl } from '../../actions/api';
import DataTable from '../../components/DataTable/DataTable';
import LoadingBlock from '../../components/LoadingBlock/LoadingBlock';
import Confirm from '../../components/Confirm/Confirm';
import { alert } from '../../actions/Functions';
import { useHistory } from 'react-router-dom';

const Templates = () => {

    const CONTEXT = useContext(StateContext);
    const history = useHistory();
    const [search,setSearch] = useState('');
    const [loadingMain,setLoadingMain] = useState(false);
    const [templates,setTemplates] = useState([]);
    const [showConfirmDelete,setSshowConfirmDelete] = useState(false);
    const [dataRemove,setDataRemove] = useState(null);

    useEffect(() => {
        CONTEXT.setBread([{ label: 'Email templates' } ]);
        CONTEXT.setActions([
            {
                type: 'search',
                label: 'Search',
                action: searchAction
            },
            {
                type: 'add',
                label: 'Add new template',
                action: () => history.push(prefixUrl+"templates/0")
            },
        ]);

        CONTEXT.setLoading(true);
        api('getTemplatesList',CONTEXT.userToken,{ search },r => {
            CONTEXT.setLoading(false);
            if (r.result){
                setTemplates(r.data.templates);
            }
        });
    },[search]);

    useEffect(() => {
        if (CONTEXT.userData.role!=='root'){
            history.push("/");
        }
    },[])

    const deleteTemplate = () => {
        setSshowConfirmDelete(false);
        CONTEXT.setLoading(true);
        api('removeTemplate/'+dataRemove.id,CONTEXT.userToken,{},r => {
            CONTEXT.setLoading(false);
            if (r.result){
                alert(r.comm,'success');
                setTemplates(templates.filter(v => v.id!=dataRemove.id));
            }
            setDataRemove(null);
        });
    }

    const editAction = data => {
        history.push(prefixUrl + 'templates/'+data.id);
    }

    const removeAction = data => {
        setSshowConfirmDelete(true);
        setDataRemove(data);
    }

    const searchAction = (s) => {
        setSearch(s);
    }

    if (loadingMain){
        return <LoadingBlock />
    }

    return (
        <TemplatesStyle>
            <Row className="body">
                <Col md={24}>
                <DataTable 
                    data={templates}
                    fields={['ID,id','Type,typeName','The title of the message,name']}
                    editAction={editAction}
                    removeAction={removeAction}
                />
                </Col>
            </Row>
            <Confirm 
                show={showConfirmDelete}
                setShow={setSshowConfirmDelete}
                callBack={deleteTemplate}
                content={"Are you sure you want to delete this template?"}
            />
        </TemplatesStyle>
    )
}

export default Templates;