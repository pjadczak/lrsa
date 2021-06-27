import React , { useState, useEffect, useContext } from 'react';
import ItemStyle from './ItemStyle';
import { useHistory , useParams } from 'react-router-dom';
import { StateContext } from '../../Front/Front';
import api , { prefixUrl } from '../../../actions/api';
import { Row, Col , Input , SelectPicker , Toggle , Icon } from 'rsuite';
import { alert , toIsoDate , DateStringConvert } from '../../../actions/Functions';
import NewItemAction from './NewItemAction/NewItemAction';
import ActionInfo from './ActionInfo/ActionInfo';
import Confirm from '../../../components/Confirm/Confirm';

const Item = () => {

    const { id } = useParams();
    const history = useHistory();
    const CONTEXT = useContext(StateContext);
    const [item,setItem] = useState(null);
    const [categories,setCategories] = useState([]);
    const [warehouses,setWarehouses] = useState([]);
    const [warehouseName,setWarehouseName] = useState('');
    const [warehouseActions,setWarehouseActions] = useState([]);
    const [itemOnState,setItemOnState] = useState(true);

    // add action
    const [statuses,setStatuses] = useState({ 0: '---' });
    const [changes,setChanges] = useState({ 0: '---' });
    const [actionUsers,setActionUsers] = useState([]);
    const [defaultValueAction] = useState({ status: 0, change: 0, user_name: '' });
    const [dataAction,setDataAction] = useState(defaultValueAction);

    const [showAction,setShowAction] = useState(false);
    const [actionData,setActionData] = useState(null);

    const [showAddAction,setShowAddAction] = useState(false);
    const [errName,setErrName] = useState(false);
    const [errUserName,setErrUserName] = useState(false);
    const [errWarehouse,setErrWarehouse] = useState(false);

    const [showConfirmRemove,setShowConfirmRemove] = useState(false);

    useEffect(() => {
        CONTEXT.setLoading(true);
        api('getWarehouseItem/'+id,CONTEXT.userToken,{},r => {
            CONTEXT.setLoading(false);
            if (r.result){
                if (id == 0){
                    setItem({ 
                        on_state: 1,
                        warehouse_id: r.data.warehouses.find(obj => obj.def === 1)?.id
                    });
                } else {
                    setItem(r.data.item);
                    const tempName = r.data.warehouses.find(obj => obj.id === parseInt(r.data.item.warehouse_id))?.name;
                    if (tempName!==undefined) {
                        setWarehouseName(tempName);
                    }
                    setItemOnState(Boolean(r.data.item.on_state));
                    setWarehouseActions(r.data.warehouseActions);
                }
                setCategories(r.data.categories);
                setWarehouses(r.data.warehouses);
                setActionUsers(r.data.users);
                setStatuses({ ...statuses,...r.data.ITEMS_STATUSES });
                setChanges({ ...changes, ...r.data.ITEMS_CHANGES });
            } else {
                history.push(prefixUrl+"warehouse");
            }
        });
    },[]);

    useEffect(() => {
        CONTEXT.setBread([{ label: 'List items', path: prefixUrl+"warehouse" },{ label: 'Warehouse item'+(item!==null ? ': '+(item?.name!==undefined ? item.name : 'create NEW') : ' - create NEW') } ]);
        CONTEXT.setActions([
            {
                type: 'back',
                title: 'Back to list',
                action: backAction
            },
            (
                (id>0 && !Boolean(item?.disabled)) ?
                {
                    type: 'other',
                    title: 'Create action',
                    icon: <Icon icon="plus-square" />,
                    action: () => setShowAddAction(true),
                } : null
            ),
            (
                (id>0) ?
                {
                    type: 'delete',
                    title: 'Remove item',
                    // icon: <Icon icon="plus-square" />,
                    action: () => setShowConfirmRemove(true),
                } : null
            ),
            {
                type: 'save',
                label: id>0 ? 'Change data item' : 'Create new Item',
                action: saveAction
            },
        ]);
    },[item]);

    const setValue = (value, field ) => {
        setItem({...item,...{ [field]: value }});
    }

    const setValueAction = (value, field ) => {
        if (typeof field === 'string') setDataAction({...dataAction,...{ [field]: value }});
        else {
            let tempObject = {};
            field.forEach((element,index) => {
                tempObject = { ...tempObject, ...{ [element]: value[index] } }
            });
            setDataAction({...dataAction,...tempObject});
        }
    }

    const backAction = () => {
        history.push(prefixUrl+"warehouse");
    }

    const saveAction  = () => {
        CONTEXT.setLoading(true);
        api('saveWarehouseItem/'+id,CONTEXT.userToken,item, r => {
            CONTEXT.setLoading(false);
            if (r.result){
                alert(r.comm,'success');
                if (r.data.newId){
                    const currentPath = prefixUrl+"warehouse/"+r.data.newId;
                    history.replace(`${currentPath}/replace`);
                    history.replace(currentPath)
                }
            } else {
                alert(r.comm,'error');
            }
        });
    }

    const addActionItemAction = () => {
        const dateSend = {
            ...dataAction, 
            ...{ 
                id, 
                date: (dataAction.date!==null && dataAction.date!==undefined) ? toIsoDate(dataAction.date) : null,
            }
        }
        api('addItemAction/'+id,CONTEXT.userToken, dateSend, r => {
            if (r.result){
                alert(r.data.comm,'success');
                if (r.data.changeWarehouse>0){
                    const currentPath = prefixUrl+"warehouse/"+id;
                    history.replace(`${currentPath}/replace`);
                    history.replace(currentPath)
                } else {
                    setWarehouseActions(r.data.warehouseActions);
                    setItem(r.data.item);
                    setItemOnState(Boolean(r.data.item.on_state));
                    setDataAction(defaultValueAction);
                }
                setShowAddAction(false);
            } else {
                alert(r.comm,'error');
                if (r.errors){
                    if (r.errors){
                        r.errors.forEach(el => {
                            if (el.indexOf('The name field')>=0) setErrName(true);
                            if (el.indexOf('The user name field')>=0) setErrUserName(true);
                            if (el.indexOf('The warehouse')>=0) setErrWarehouse(true);
                        });
                    }
                }
            }
        });
    }

    const Status = ({ status }) => {
        switch (status){
            case 1: case 4: case 5: return <Icon icon="arrow-circle-up" className="up" />;
            case 2: case 3: case 99: return <Icon icon="arrow-circle-down" className="down" />;
            default: return <Icon icon="times-circle" className="noAction" />;
        }   
    }

    const operationName = statusNumber => {
        return statuses[statusNumber];
    }

    const removeActionItem = () => {
        setShowConfirmRemove(false);
        api('removeWarehouseItem/'+id,CONTEXT.userToken, {}, r => {
            if (r.result){
                alert(r.comm,'success');
                history.push(prefixUrl+'warehouse');
            } else {
                alert(r.comm,'error');
            }
        });
    }

    return (
        <ItemStyle>
            <Row>
                <Col md={24}>
                    <Row>
                        <Col md={10}>
                            <label>Item name</label>
                            <Input disabled={Boolean(item?.disabled)} value={String(item?.name!==undefined ? item.name : '')} onChange={v => setValue(v,'name')} />
                        </Col>
                        <Col md={3}>
                            <label>Item code</label>
                            <Input disabled={Boolean(item?.disabled)} value={String(item?.code!==undefined ? item.code : '')} onChange={v => setValue(v,'code')} />
                        </Col>
                        <Col md={4}>
                            <label>Category</label>
                            <SelectPicker 
                                value={item?.warehouse_category_id}
                                onChange={v => setValue(v,'warehouse_category_id')}
                                disabled={Boolean(item?.disabled)}
                                data={categories.map(obj => {
                                    return { label: obj.name, value: obj.id }
                                })}
                                cleanable={false}
                            />
                        </Col>
                        <Col md={4}>
                            <label>Warehouse</label>
                            {id == 0 &&
                                <SelectPicker 
                                    value={item?.warehouse_id}
                                    onChange={v => setValue(v,'warehouse_id')}
                                    data={warehouses.map(obj => {
                                        return { label: obj.name, value: obj.id }
                                    })}
                                    cleanable={false}
                                />
                            }
                            {id!==0 &&
                                <div className="warehouseName">{warehouseName}</div>
                            }
                        </Col>
                        <Col md={3}>
                            <label>Equipment in stock</label>
                            <div className={"onState state-"+Number(itemOnState)}>{itemOnState ? 'Yes' : 'No'}</div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col md={24}>
                    <table className="actions">
                        <thead>
                            <tr>
                                <td>Title</td>
                                <td>Operation</td>
                                <td>User name</td>
                                <td>&nbsp;</td>
                                <td>Date</td>
                            </tr>
                        </thead>
                        <tbody>
                            {warehouseActions.map(obj => (
                                <tr key={`actions_${obj.id}`} onClick={() => {
                                    setShowAction(true);
                                    setActionData(obj);
                                }}>
                                    <td>{obj.name}</td>
                                    <td>{operationName(obj.status)}</td>
                                    <td>{obj.user_name}{obj.date_suggested!==null ? ' ['+obj.date_suggested+']' : ''}</td>
                                    <td className="short">{obj.status === null ? '-' : <Status status={obj.status} />}</td>
                                    <td className="date">{DateStringConvert(obj.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Col>
            </Row>
            {showAddAction &&
                <NewItemAction
                    setShow={setShowAddAction}
                    setValueAction={setValueAction}
                    dataAction={dataAction}
                    setDataAction={setDataAction}
                    actionUsers={actionUsers}
                    statuses={statuses}
                    changes={changes} 
                    addActionItemAction={addActionItemAction}
                    errName={errName}
                    setErrName={setErrName}
                    errUserName={errUserName}
                    setErrUserName={setErrUserName}
                    warehouses={warehouses}
                    item={item}
                    errWarehouse={errWarehouse}
                    setErrWarehouse={setErrWarehouse}
                />
            }
            {(showAction && actionData!==null) && <ActionInfo data={actionData} setShow={setShowAction} operationName={operationName} warehouses={warehouses} changes={changes} />}
            <Confirm show={showConfirmRemove} setShow={setShowConfirmRemove} buttonOk="Remove" content="Are you sure you want to delete this item?" callBack={() => removeActionItem()} />
        </ItemStyle>
    );
}
export default Item;