import React from 'react';
import { Row, Col, Input, SelectPicker , DatePicker, Icon , Button } from 'rsuite';
import { isEmpty } from '../../../../actions/Functions';
import Overlay from '../../../../Styles/Overlay';

const NewItemAction = ({ dataAction , setValueAction , actionUsers , statuses , changes , setShow , addActionItemAction , errName , setErrName , errUserName , setErrUserName , warehouses , item , errWarehouse , setErrWarehouse }) => {

    return (
        <Overlay>
            <div className="overlayBg" onClick={() => setShow(false)}></div>
            <div className="overlay">
                <header>Add new action</header>
                <div className="body">
                    <Row>
                        <Col md={12} className={errName ? 'error' : ''}>
                            <label>Action name</label>
                            <Input value={dataAction?.name !== undefined ? dataAction.name : ''} onChange={v => setValueAction(v,'name')} onFocus={() => setErrName(false)} />
                        </Col>
                        <Col md={12}>
                            <label>Suggested Date</label>
                            <DatePicker
                                value={dataAction?.date}
                                size="md"
                                placeholder="Small"
                                onChange={v => setValueAction(v,'date')}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <label>User</label>
                            <SelectPicker 
                                value={dataAction?.user_id}
                                onChange={v => {
                                    const user = actionUsers.find(obj => obj.id === v);
                                    if (!isEmpty(user)){
                                        return setValueAction([v,`${user.name} ${user.surname}`],['user_id','user_name']);
                                    }
                                    setValueAction(v,'user_id');
                                }}
                                data={actionUsers.map(obj => {
                                    return { label: obj.name + ' ' + obj.surname + ' ['+obj.roleName+']'  , value: obj.id }
                                })}
                            />
                        </Col>
                        <Col md={12} className={errUserName ? 'error' : ''}>
                            <label>User name</label>
                            <Input value={dataAction?.user_name !== undefined ? dataAction.user_name : ''} onChange={v => setValueAction(v,'user_name')} onFocus={() => setErrUserName(false)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <label>Operation</label>
                            <SelectPicker 
                                value={dataAction?.status}
                                onChange={v => {
                                    setValueAction(v,'status');
                                    setErrWarehouse(false);
                                }}
                                data={Object.keys(statuses).map(key => {
                                    return { label: statuses[key]  , value: Number(key) }
                                })}
                                cleanable={false}
                                searchable={false}
                            />
                        </Col>
                        {dataAction?.status === 1 &&
                            <Col md={6} className={errWarehouse ? 'error' : ''}>
                                <label>Select warehouse</label>
                                <SelectPicker 
                                    value={dataAction?.warehouse_id}
                                    onChange={v => {
                                        setValueAction(v,'warehouse_id')
                                        setErrWarehouse(false);
                                    }}
                                    data={warehouses.filter(obj => obj.id!== item.warehouse_id).map(obj => {
                                        return { label: obj.name , value: obj.id }
                                    })}
                                    cleanable={false}
                                />
                            </Col>
                        }
                        <Col md={dataAction?.status === 1 ? 6 : 12}>
                            <label>Change on Item</label>
                            <SelectPicker 
                                value={dataAction?.change}
                                onChange={v => setValueAction(v,'change')}
                                data={Object.keys(changes).map(key => {
                                    return { label: changes[key]  , value: Number(key) }
                                })}
                                cleanable={false}
                                searchable={false}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label>Comment</label>
                            <Input value={dataAction?.comment!==undefined ? dataAction.comment : ''} onChange={v => setValueAction(v,'comment')} componentClass="textarea" rows={7} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="buttons">
                            <Button appearance="primary" onClick={addActionItemAction}><Icon icon="save" /> Add Action</Button>
                            <Button appearance="primary" color="orange" className="close" onClick={() => setShow(false)}><Icon icon="times-circle" /> Close</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </Overlay>
    );
}
export default NewItemAction;