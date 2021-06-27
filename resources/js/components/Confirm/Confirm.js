import React, { useState } from 'react';
import { Modal , Button , Icon , Loader, Input } from 'rsuite';
import ConfirmStyle from './ConfirmStyle';

const Confirm = ({
        show , 
        setShow, 
        content, 
        image = null,
        setImageLightbox = null,
        showIco = true,
        callBack, 
        buttonOk = 'Remove' , 
        buttonSave = "Save" , 
        fSave = null , 
        buttonOkColor = null , 
        loading = false,
        inputValue = null,
        setInputValue=null,
        inputPlaceholder= ''
    }) => {

    const handleImageClick = event => {
        event.preventDefault();
        setShow(false);
        setImageLightbox();
    }

    return (
        <>
            <Modal backdrop="static" show={show} size="xs">
                <ConfirmStyle>
                    <Modal.Body style={{ overflow: 'unset' }}>
                        <div className="content">
                            {showIco &&
                                <Icon
                                    icon="remind"
                                    style={{
                                        color: '#ffb300',
                                        fontSize: 24
                                    }}
                                />
                            }
                            {image!==null && 
                                <div className="image">
                                    {setImageLightbox!==null ? <a href="" onClick={handleImageClick}><img src={image} /></a> : <img src={image} />}
                                    
                                </div>
                            }
                        </div>
                    {content}
                    {(setInputValue!==null && inputValue!==null) && 
                        <div style={{ marginTop: 20 }}>
                            <Input value={inputValue} onChange={text => setInputValue(text)} placeholder={inputPlaceholder} />
                        </div>
                    }
                    {loading && <div style={{ marginTop: 20, textAlign: 'center' }}><Loader size="md" /></div>}
                </Modal.Body>
                {!loading &&
                    <Modal.Footer>
                        <Button onClick={callBack} appearance="primary" color={buttonOkColor}>
                            {buttonOk}
                        </Button>
                        {fSave!==null &&
                            <Button onClick={fSave} style={{ float: 'left', }} appearance="primary" color={"green"}>
                                {buttonSave}
                            </Button>
                        }
                        <Button onClick={() => setShow(false)} appearance="subtle">
                            Close
                        </Button>
                    </Modal.Footer>
                }
            </ConfirmStyle>
            </Modal>
        </>
    )
}

export default Confirm;
