import React , { useState, useEffect, useContext } from 'react';
import ModalColHeaderStyle from './ModalColHeaderStyle';
import { Modal , Button , Row , Col , Input , SelectPicker } from 'rsuite';

const headersType = [ 
    { value: 'h1', label: 'Hedear H1' }, 
    { value: 'h2', label: 'Hedear H2' }, 
    { value: 'h3', label: 'Hedear H3' }, 
    { value: 'h4', label: 'Hedear H4' }, 
    { value: 'h5', label: 'Hedear H5' }, 
    { value: 'h6', label: 'Hedear H6' }, 
    { value: 'p', label: 'Parahraph' }, 
];

const defaultType = 'h3';

const ModalColHeader = ({ show, setShow, actionOk , data , defaultColHeader }) => {

    const [headerText,setHeaderText] = useState('');
    const [headerType,setHeaderType] = useState(defaultColHeader.type);
    const [classText,setClassText] = useState('');

    useEffect(() => {
        if (data!==null){
            setHeaderText(data.col.header.value === null ? '' : data.col.header.value);
            setHeaderType(data.col.header.type === null ? '' : data.col.header.type);
            setClassText(data.col.header.class === null ? '' : data.col.header.class);
        }
    },[data]);

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title>Ustawienie treści</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalColHeaderStyle>
                        <div className="header">
                            <Row>
                                <Col md={12}>
                                    <label>Nagłówek</label>
                                    <Input value={headerText} onChange={text => setHeaderText(text)} />
                                </Col>
                                <Col md={6}>
                                    <label>Rodzaj</label>
                                    <SelectPicker 
                                        value={headerType} 
                                        data={headersType} 
                                        onChange={v => setHeaderType(v)} 
                                        block={true}
                                        cleanable={false}
                                        searchable={false}
                                    />
                                </Col>
                                <Col md={6}>
                                    <label>Klasa css</label>
                                    <Input value={classText} onChange={text => setClassText(text)} />
                                </Col>
                            </Row>
                        </div>
                    </ModalColHeaderStyle>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => actionOk(headerText,headerType,classText)} appearance="primary">
                        Zmień
                    </Button>
                    <Button onClick={() => setShow(false)} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default ModalColHeader;