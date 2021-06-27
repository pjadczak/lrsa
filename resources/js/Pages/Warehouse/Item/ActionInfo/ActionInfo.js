import React , { useState, useEffect, useContext } from 'react';
import Overlay from '../../../../Styles/Overlay';
import { Row, Col , Button , Icon } from 'rsuite';
import { DateStringConvert } from '../../../../actions/Functions';
import parse from 'html-react-parser';

const ActionInfo = ({ data ,setShow , operationName , warehouses , changes }) => {

    return (
        <Overlay>
            <div className="overlayBg" onClick={() => setShow(false)}></div>
            <div className="overlay">
                <header><span style={{ color: 'grey' }}>[{DateStringConvert(data.created_at)}]</span> {data.name}</header>
                <div className="body">
                    <Row className="row-table">
                        <Col md={6}>
                            <label>User name</label>
                            <div className="value">{data.user_name!='' ? data.user_name : '-'}</div>
                        </Col>
                        <Col md={6}>
                            <label>Operation</label>
                            <div className="value">{operationName(data.status)}</div>
                        </Col>
                        <Col md={4}>
                            <label>Warehouse</label>
                            <div className="value">
                                {data.warehouse_id ? 
                                    warehouses.find(obj => obj.id === data.warehouse_id)?.name
                                    : '-'
                                }
                            </div>
                        </Col>
                        <Col md={4}>
                            <label>Moderator</label>
                            <div className="value value-mod">{data.userMod}</div>
                        </Col>
                        <Col md={4}>
                            <label>Changes</label>
                            <div className="value">
                                {data.state>0 ? 
                                    changes[data.state]
                                    : '-'
                                }
                            </div>
                        </Col>
                    </Row>
                    {data.contets!='' &&
                        <Row>
                            <Col className="content" cols={24}>{parse(data.comment.replace('\n','<br />'))}</Col>
                        </Row>
                    }
                    <Row>
                        <Col className="buttons">
                            <Button appearance="primary" color="orange" className="close" onClick={() => setShow(false)}><Icon icon="times-circle" /> Close</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </Overlay>
    );
}
export default ActionInfo;