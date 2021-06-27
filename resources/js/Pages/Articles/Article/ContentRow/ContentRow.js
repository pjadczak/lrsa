import React , { useState, useEffect, useCallback } from 'react';
import ContentRowStyle from './ContentRowStyle';
import { Icon , Dropdown , ButtonToolbar , ButtonGroup , IconButton , Modal } from 'rsuite';
import Editor from '../../../../components/Editor/Editor';
import Photo from '../../../../components/Photo/Photo';
import Gallery from '../../../../components/Gallery/Gallery';
import { generateRandomString } from '../../../../actions/Functions';
import ModalColHeader from './ModalColHeader/ModalColHeader';

const contentTypes = [
    { label: 'Edytor tekstu', value: 'text', icon: 'edit' },
    { label: 'Zdjęcie', value: 'photo', icon: 'image' },
    { label: 'Galeria zdjęć', value: 'gallery', icon: 'object-group' },
];

const getValueTypeOfContent = type => {
    if (type == 'gallery') return [];
    return '';
}

const defaultContext = 'text';
const defaultColHeader = { value: '', type: 'h3', class: '' };

const ContentRow = ({ CONTEXT , content , setContent , createDefaultContext , id }) => {

    const [contentSaveData,setContentSaveData] = useState('');
    const [dataModal,setDataModal] = useState(null);
    const [showDataModal,setShowDataModal] = useState(false);
    const [editorHeight,setEditorHeight] = useState(295);

    useEffect(() => {
        if (createDefaultContext && content.length==0){
            createRow(defaultContext);
        }
    },[createDefaultContext]);

    useEffect(() => {
        if (contentSaveData!=null){
            setValueCol(contentSaveData.value,contentSaveData.row,contentSaveData.col);
            setContentSaveData(null);
        }
        if (content.length==1 && content[0].data.length==1){
            setEditorHeight(id>0 ? 552 : 486);
        } else {
            setEditorHeight(360);
        }
    },[content,contentSaveData]);

    /*
     * Add new Empty Content Data
     **/
    const buildColumn = (obj,type) => {
        setContent(v => v.map((o) => {
            if (obj.idRow == o.idRow) {
                o.data.push({ 
                    type, 
                    showOptions: false, 
                    label: '',
                    value: getValueTypeOfContent(type) , 
                    id: generateRandomString(20,false),
                    header: defaultColHeader
                });
            }
            return o;
        }));
    }

    const getValueCol = (row,col) => {
        let returnValue = null;
        content.forEach(obj => {
            if (row.idRow == obj.idRow){
                obj.data.forEach(objCol => {
                    if (objCol.id==col.id){
                        returnValue = objCol.value;
                        return null;
                    }
                });
                return null;
            }
        });
        return returnValue;
    }

    /*
     * Change cell value
     **/
    const setValueCol = (value,row,col) => {
        const dataTemp = content.map(obj => {
            if (obj.idRow == row.idRow){
                obj.data.forEach((objCol,index) => {
                    if (objCol.id == col.id){
                        obj.data[index].value = value;
                    }
                });
            }
            return obj;
        });
        setContent(dataTemp);
    };


    const buildContent = (row,col) => {
        if (col.type == 'text') {
            return <Editor 
                        content={getValueCol(row,col)} 
                        setContent={value => setContentSaveData({value,row,col})} 
                        height={row.data.length==1 ? editorHeight : 295}
                        lessIcons={true} 
                        name={`editor_${row.idRow}_${col.id}`}
                    />
        } else if (col.type == 'photo') {
            return <Photo 
                photo={getValueCol(row,col)}
                content={content}
                setPhoto={photo => setContentSaveData({value: photo,row,col})}
                CONTEXT={CONTEXT}
                urlAppend={'uploadContentPhotoArticle/'+col.id}
                urlRemove={null}
            />
        } else if (col.type == 'gallery'){
            return <Gallery 
                        CONTEXT={CONTEXT} 
                        photos={getValueCol(row,col)}
                        setPhotos={photos => setContentSaveData({value: photos,row,col})} 
                        urlAppend={'uploadContentPhotoArticle/'+col.id}
                    />
        }
        return <p>{col.type}</p>
    }

    const removeCol = (event,idRow,id) => {
        event.preventDefault();
        setContent(content.map(obj => {
            if (obj.idRow == idRow){
                obj.data = obj.data.filter(o => o.id!=id);
            }
            return obj;
        }));
    }

    const showHeaderCol = (event,row,col) => {
        event.preventDefault();
        setDataModal({ row,col });
        setShowDataModal(true);
    }

    // update headers cell
    const setColData = (value,type,classText) => {
        setShowDataModal(false);
        const dataTemp = content.map(obj => {
            if (obj.idRow == dataModal.row.idRow){
                obj.data.forEach((objCol,index) => {
                    if (objCol.id == dataModal.col.id){
                        if (obj.data[index].header!==undefined){
                            obj.data[index].header.value = value;
                            obj.data[index].header.type = type;
                            obj.data[index].header.class = classText;
                        } else {
                            obj.data[index].header = { value, type, class: classText };
                        }
                    }
                });
            }
            return obj;
        });
        setContent(dataTemp);
    }

    /*
     * Move left/right data content
     **/
    const moveCol = (event,row,col,direction) => {
        event.preventDefault();
        let tempData = null;
        const dataResult = [];
        content.forEach((obj,index) => {
            if (obj.idRow == row.idRow){
                let foundIndex = -1;
                obj.data.forEach((objCol,indexCol) => {
                    if (objCol.id == col.id){
                        foundIndex = indexCol;
                        tempData = objCol;
                    }
                });
                if (tempData!==null){
                    obj.data = obj.data.filter(objCol => objCol.id!=tempData.id);
                    obj.data.splice(direction == 'left' ? foundIndex-1 : foundIndex+1 , 0, tempData);
                }
            }
            dataResult.push(obj);
        });
        setContent(dataResult);
    }

    /*
     * move up/down row content
     **/
    const moveRow = (event,row,direction) => {
        event.preventDefault();
        let tempData = null;
        let foundIndex = -1;
        content.forEach((obj,index) => {
            if (obj.idRow == row.idRow){
                tempData = row;
                foundIndex = index;
            }
        });
        if (foundIndex>=0){
            const dataResult = content.filter(obj => obj.idRow!=row.idRow);
            dataResult.splice(direction == 'up' ? foundIndex-1 : foundIndex+1 , 0, tempData);
            setContent(dataResult);
        }
    }

    const switchOptionsRow = (event,row) => {
        event.preventDefault();
        setContent(content.map(obj => {
            if (row.idRow == obj.idRow){
                obj.showOptions = !obj.showOptions;
            }
            return obj;
        }));
    }

    const createRow = (type) => {
        setContent(v => [
            ...v,
            ...[
                {
                    idRow: generateRandomString(20,false), 
                    data: [{ 
                        type,
                        showOptions: false,
                        header: defaultColHeader,
                        value: getValueTypeOfContent(type),
                        id: generateRandomString(20,false) 
                    }] 
                } 
            ]
        ])
    }

    /*
     * Remove empty row
     **/
    const removeRow = (event,row) => {
        event.preventDefault();
        setContent(content.filter(obj => obj.idRow != row.idRow));
    }

    return (
        <ContentRowStyle>
            <ModalColHeader 
                show={showDataModal}
                setShow={setShowDataModal}
                actionOk={setColData}
                data={dataModal}
                defaultColHeader={defaultColHeader}
            />
            {content.map((row,index) => {
                return (
                    <div className={"contentRow"+(row.showOptions ? ' showOptions' : '')+(row.data.length==1 ? ' contentSingle' : '')} key={`key_contentRow_${index}`}>
                        {row.data.map((col,indexCol) => {
                            return (
                                <div className={"contentCol type-"+col.type} key={`col_${row.idRow}_${col.id}`}>
                                    {buildContent(row,col)}
                                    {/* <p style={{ zIndex: 10000, position: 'absolute', top: 10, left: 10 }}>{indexCol} - {row.length}</p> */}
                                    <div className="toolCol">
                                        <a className="button removeCol" href="" onClick={event => removeCol(event,row.idRow,col.id)}><Icon icon="times-circle" /></a>
                                        <a className="button header" href="" onClick={event => showHeaderCol(event,row,col)}><Icon icon="cogs" /></a>
                                        {indexCol>0 && <a className="button move" href="" onClick={event => moveCol(event,row,col,'left')}><Icon icon="arrow-left" /></a>}
                                        {indexCol+1<row.data.length && <a className="button move" href="" onClick={event => moveCol(event,row,col,'right')}><Icon icon="arrow-right" /></a>}
                                    </div>
                                </div>
                            )
                        })}
                        <div className="toolRow">
                            <ul className="Main">
                                {row.data.length>0 && <li><a className="button switch" href="" title="Switch options" onClick={event => switchOptionsRow(event,row)}><Icon icon="cog" /></a></li>}
                                <li>
                                    <ButtonToolbar>
                                        <ButtonGroup>
                                            <Dropdown
                                                placement="bottomEnd"
                                                renderTitle={() => {
                                                    return <IconButton icon={<Icon icon="plus-circle" />} />;
                                                }}
                                            >
                                                {contentTypes.map((obj,indexMenu) => <Dropdown.Item key={`dropdown_${row.idRow}_${indexMenu}`} value={obj.value} onClick={e => buildColumn(row,e.target.getAttribute("value"))} icon={<Icon icon={obj.icon} />}>{obj.label}</Dropdown.Item>)}
                                            </Dropdown>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </li>
                                {(row.data.length==0 && content.length>1) && <li><a className="button remove" href="" title="Remove Row" onClick={event => removeRow(event,row)}><Icon icon="times-circle" /></a></li>}
                                {index>0 && <li><a className="button move" href="" title="Move UP" onClick={event => moveRow(event,row,'up')}><Icon icon="arrow-up" /></a></li>}
                                {index+1<content.length && <li><a className="button move" href="" title="Move DOWN" onClick={event => moveRow(event,row,'down')}><Icon icon="arrow-down" /></a></li>}
                            </ul>
                        </div>
                    </div>
                )
            })}
            <ButtonToolbar className="addNewRow">
                <ButtonGroup>
                    <Dropdown
                        // placement="bottomEnd"
                        renderTitle={() => {
                            return <IconButton icon={<Icon icon="plus-circle" />} />;
                        }}
                    >
                        {contentTypes.map((obj,indexMenu) => <Dropdown.Item key={`dropdown_0_${indexMenu}`} value={obj.value} onClick={e => createRow(e.target.getAttribute("value"))} icon={<Icon icon={obj.icon} />}>{obj.label}</Dropdown.Item>)}
                    </Dropdown>
                </ButtonGroup>
            </ButtonToolbar>
        </ContentRowStyle>
    );
}
export default ContentRow;