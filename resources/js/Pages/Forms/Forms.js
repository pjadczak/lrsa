import React , { useState, useEffect, useContext } from 'react';
import FormsStyle from './FormsStyle';
import api from '../../actions/api';
import { StateContext } from '../Front/Front';
import DataTable from '../../components/DataTable/DataTable';
import { Pagination , Modal , Button , Icon } from 'rsuite';
import parse from 'html-react-parser';

const Forms = () => {

    const CONTEXT = useContext(StateContext);
    const [forms,setForms] = useState([]);
    const [search,setSearch] = useState('');

    const [pagCurrent,setPagCurrent] = useState(1);
    const [pagePages,setPagePages] = useState(10);
    const [pageParts,setPageParts] = useState(10);

    const [modalData,setModalData] = useState(null);

    useEffect(() => {
        CONTEXT.setBread([{ label: 'List of requests' } ]);
        CONTEXT.setActions([
            {
                type: 'search',
                label: 'Search',
                action: searchAction
            },
        ]);
    },[]);

    useEffect(() => {
        readData();
    },[pagCurrent,search]);

    const searchAction = (s) => {
        setSearch(s);
    }

    const readData = () => {
        const dataSend = {
            pagCurrent,
            search
        }
        CONTEXT.setLoading(true);
        api('getFormsList',CONTEXT.userToken,dataSend,r => {
            CONTEXT.setLoading(false);
            if (r.result){
                setForms(r.data.forms);
                if (r.data.forms_count!==null){
                    setPagePages(r.data.forms_count);
                }
                if (r.data.parts!==null){
                    setPageParts(r.data.parts);
                }
            }
        });
    }

    const editAction = (obj) => {
        setModalData(obj);
        if (obj.dataRead === null){
            CONTEXT.setLoading(true);
            api('makeFormRead/'+obj.id,CONTEXT.userToken,{},r => {
                CONTEXT.setLoading(false);
                if (r.result){
                    setForms(forms.map(element => {
                        if (element.id == obj.id){
                            element.dataRead = r.data.dataRead
                        }
                        return element;
                    }));
                }
            });
        }
    }

    return (
        <FormsStyle>
            {pagePages>pageParts &&
                <Pagination 
                    pages={Math.ceil(pagePages/pageParts)}
                    activePage={pagCurrent}
                    onSelect={obj => setPagCurrent(obj)}
                    maxButtons={5}
                    size="md"
                    first
                    last
                />
            }
            <DataTable 
                data={forms}
                fields={['ID,id','Applicant,name','E-mail,email','IP,ip','Post date,dateAdd']}
                otherAction={{ action: editAction, value: <Icon icon="gear" /> }}
                disabledAction={obj => obj.dataRead == null}
            />

            <Modal show={modalData!==null} onHide={() => setModalData(null)}>
                <Modal.Header>
                    {modalData!==null && <Modal.Title>{`Application dated ${modalData.dateAdd}`}</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    {modalData!==null &&
                        <>
                            <p>Applicant: <strong>{modalData.name}</strong></p>
                            <p>E-mail: <a href={"mailto:"+modalData.email}>{modalData.email}</a></p>
                            <p>IP: <strong>{modalData.ip}</strong></p>
                            <p className="content">{parse(modalData.content)}</p>
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setModalData(null)} appearance="primary">
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </FormsStyle>
    );
}
export default Forms;