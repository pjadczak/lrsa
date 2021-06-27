import React , { useState, useEffect, useContext } from 'react';
import Overlay from '../../../Styles/Overlay';
import { Row, Col, Input , Button , Icon , SelectPicker } from 'rsuite';
import api from '../../../actions/api';
import { StateContext } from '../../Front/Front';
import { alert } from '../../../actions/Functions';
import Confirm from '../../../components/Confirm/Confirm';

const WarehouseMain = ({ setWarehouseId , setWarehousesAll , warehousesAll }) => {

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
            setName(warehousesAll.find(obj => obj.id === id).name);
        }
    },[id]);

    const saveAction = () => {
        setLoading(true);
        api('saveWarehouse/'+id,CONTEXT.userToken,{ name },r => {
            setLoading(false);
            if (r.result){
                if (r.data.newId>0){
                    setWarehousesAll(v => [...v,...[r.data.category]]);
                    setWarehouseId(null);
                    alert(r.data.comm,'success');
                } else {
                    setWarehousesAll(warehousesAll.map(obj => {
                        if (obj.id === r.data.warehouse.id){
                            obj.name = r.data.warehouse.name;
                        }
                        return obj;
                    }));
                    setWarehouseId(null);
                    alert(r.data.comm,'success');
                }
            } else {
                alert(r.comm,'error');
            }
        });
    }

    const removeAction = () => {
        setLoading(true);
        api('removeWarehouse/'+id,CONTEXT.userToken,{},r => {
            setLoading(false);
            if (r.result){
                setShowConfirmRemove(false);
                setWarehousesAll(v => v.filter(obj => obj.id!==id));
                setWarehouseId(null);
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
            <div className="overlayBg" onClick={() => setWarehouseId(null)}></div>
            <div className={"overlay"+(loading ? ' loadingLayer' : '')}>
                <header>{id>0 ? 'Edit warehouse' : 'Add new warehouse'}</header>
                <div className="body">
                    <Row>
                        <Col md={12}>
                            <label>Warehouse name</label>
                            <Input value={name} onChange={v => setName(v)} onKeyDown={ev => handleKeyDown(ev)} />
                        </Col>
                        <Col md={12}>
                            <label>Choose warehouse</label>
                            <SelectPicker 
                                value={id}
                                onChange={v => setId(v)}
                                data={warehousesAll.map(obj => {
                                    return { value: obj.id, label: obj.name }
                                })} 
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="buttons">
                            <Button appearance="primary" onClick={() => saveAction()}><Icon icon="save" /> {id>0 ? 'Change exist warehouse' : 'Add new'}</Button>
                            <Button appearance="primary" color="orange" className="close" onClick={() => setWarehouseId(null)}><Icon icon="times-circle" /> Close</Button>
                            {id>0 && <Button appearance="primary" className="remove" onClick={() => setShowConfirmRemove(true)}><Icon icon="times-circle" /> Remove warehouse</Button>}
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
export default WarehouseMain;