import React , { useState, useEffect, useContext } from 'react';
import Overlay from '../../../Styles/Overlay';
import { Row, Col, Input , Button , Icon , SelectPicker } from 'rsuite';
import api from '../../../actions/api';
import { StateContext } from '../../Front/Front';
import { alert } from '../../../actions/Functions';
import Confirm from '../../../components/Confirm/Confirm';

const Category = ({ setCategoryId , setCategoriesAll , categoriesAll }) => {

    const CONTEXT = useContext(StateContext);
    const [name,setName] = useState('');
    const [loading,setLoading] = useState(false);
    const [id,setId] = useState(0);

    const [showConfirmRemove,setShowConfirmRemove] = useState(false);

    useEffect(() => {
        if (id === null){
            setId(0);
        } else if (id === 0){
            setName('');
        } else if (id > 0){
            setName(categoriesAll.find(obj => obj.id === id).name);
        }
    },[id]);

    const saveAction = () => {
        setLoading(true);
        api('saveCategoryWarehouse/'+id,CONTEXT.userToken,{ name },r => {
            setLoading(false);
            if (r.result){
                if (r.data.newId>0){
                    setCategoriesAll(v => [...v,...[r.data.category]]);
                    setCategoryId(null);
                    alert(r.data.comm,'success');
                } else {
                    setCategoriesAll(v => v.map(obj => {
                        if (obj.id === r.data.category.id){
                            obj.name = r.data.category.name;
                        }
                        return obj;
                    }));
                    setCategoryId(null);
                    alert(r.data.comm,'success');
                }
            } else {
                alert(r.comm,'error');
            }
        });
    }

    const removeAction = () => {
        setLoading(true);
        api('removeCategoryWarehouse/'+id,CONTEXT.userToken,{},r => {
            setLoading(false);
            if (r.result){
                setShowConfirmRemove(false);
                setCategoriesAll(v => v.filter(obj => obj.id!==id));
                setCategoryId(null);
                alert(r.data.comm,'success');
            } else {
                alert(r.comm,'error');
            }
        });
    }

    const handleKeyDown = ev => {
        if (ev.keyCode==13){
            saveAction();
        }
    }

    return (
        <Overlay>
            <div className="overlayBg" onClick={() => setCategoryId(null)}></div>
            <div className={"overlay"+(loading ? ' loadingLayer' : '')}>
                <header>{id>0 ? 'Edit category' : 'Add new category'}</header>
                <div className="body">
                    <Row>
                        <Col md={12}>
                            <label>Category name</label>
                            <Input value={name} onChange={v => setName(v)} onKeyDown={ev => handleKeyDown(ev)} />
                        </Col>
                        <Col md={12}>
                            <label>Choose category</label>
                            <SelectPicker 
                                value={id}
                                onChange={v => setId(v)}
                                data={categoriesAll.map(obj => {
                                    return { value: obj.id, label: obj.name }
                                })} 
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="buttons">
                            <Button appearance="primary" onClick={() => saveAction()}><Icon icon="save" /> {id>0 ? 'Change category' : 'Add new'}</Button>
                            <Button appearance="primary" color="orange" className="close" onClick={() => setCategoryId(null)}><Icon icon="times-circle" /> Close</Button>
                            {id>0 && <Button appearance="primary" className="remove" onClick={() => setShowConfirmRemove(true)}><Icon icon="times-circle" /> Remove category</Button>}
                        </Col>
                    </Row>
                </div>
            </div>
            <Confirm 
                setShow={setShowConfirmRemove} 
                show={showConfirmRemove} 
                content={'Are you sure you want to delete this category?'} 
                callBack={removeAction}
                buttonOk={'Remove'}
            />
        </Overlay>
    );
}
export default Category;