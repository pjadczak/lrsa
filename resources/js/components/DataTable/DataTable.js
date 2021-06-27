import React , { useState , useEffect } from 'react';
import { currency } from '../../actions/variables';
import { rand } from '../../actions/Functions';
import { Button , Icon } from 'rsuite';
import { urlPhotos } from '../../actions/api';
import Lightbox from 'react-image-lightbox';

const DataTable = ({ 
                    search = '',
                    searchField = [],
                    active = null,
                    editAction = null,
                    removeAction = null,
                    otherAction = null,
                    data, 
                    fields,
                    selectedAction , 
                    disabledAction , 
                    listName = 'list',
                    actionCell = () => null
                }) => {

    const [dataSearch,setDataSearch] = useState(data);

    const [lightbox,setLightbox] = useState(false);
    const [images,setImages] = useState([]);
    const [photoIndex,setPhotoIndex] = useState(0);

    useEffect(() => {
        let temp = [...data];
        if (search!=''){
            temp = temp.filter(el => {
                for(let i=0;i<searchField.length;i++){
                    if (search=='' || String(el[searchField[i]]).toLowerCase().indexOf(search.toLowerCase())>=0){
                        return true;
                    }
                };
            });    
        }
        setDataSearch(temp);
    },[search,data]);

    // pokazanie wartości w komórce
    const showValue = (el, v) => {
        const arr = v.split('|');
        if (arr[1]!==undefined){
            if (arr[1]=='yes'){
                switch (el[arr[0]]){
                    case -1: return '-';
                    case null: case 0 : return 'NIE';
                    default: return <strong>TAK</strong>;
                }
            } else if (arr[1]=='seconds'){
                // 
                if (parseInt(el[arr[0]])==0 || el[arr[0]]===null){
                    return '-';
                } else {
                    return new Date(parseInt(el[arr[0]]) * 1000).toISOString().substr(11, 8);
                }
            } else if (arr[1]=='nr'){
                // 
                if (parseInt(el[arr[0]])==0 || el[arr[0]]==null){
                    return '-';
                } else {
                    return parseInt(el[arr[0]]);
                }
            } else if (arr[1]=='nrInf'){
                // 
                if (parseInt(el[arr[0]])==0 || el[arr[0]]==null){
                    return <span>&infin;</span>;
                } else {
                    return parseInt(el[arr[0]]);
                }
            } else if (arr[1]=='%'){
                if (parseInt(el[arr[0]])==0 || el[arr[0]]==null){
                    return '-';
                } else {
                    return parseInt(el[arr[0]])+'%';
                }
            } else if (arr[1]=='active'){
                if (parseInt(el[arr[0]])<=0){
                    return <Icon icon="times-circle" style={{ color: 'red' }} />;
                } else {
                    return <Icon icon="check" style={{ color: 'green' }} />;
                }
            } else if (arr[1]=='$'){
                if (parseInt(el[arr[0]])==0 || el[arr[0]]==null){
                    return '-';
                } else {
                    return el[arr[0]].toFixed(2)+' '+currency;
                }
            } else if (arr[1]=='photo'){
                if (el[arr[0]]!=='') return (
                    <a href="" onClick={event => handleClickLightBox(event,urlPhotos+el[arr[0]])}>
                        <img src={urlPhotos+"small/"+el[arr[0]]} />
                    </a>
                );
                else return '';
            } else if (arr[1]=='log'){
                const s = el[arr[0]].split('|');
                return <span className="log"><span>{s[0]}</span>{s[1]!==undefined ? <>, <span>{s[1]}</span></> : null}</span>;
            } else {
                return el[arr[0]]+arr[1];
            }
        }
        return el[v];
    }

    const handleClickLightBox = (event,photoUrl) => {
        event.preventDefault();
        setImages([photoUrl]);
        setLightbox(true);
    }

    return (
        <>
            <table className="tableList">
                <thead>
                    <tr>
                        {fields.map((obj,index) => {
                            const data = obj.split(",");
                            return (
                                <td key={`id_${listName}_${index}`} className={"td-label-"+data[1]}>{data[0]}</td>
                            )
                        })}
                        {(editAction!==null || removeAction!==null || otherAction!=null) && <td className="actions">&nbsp;</td>}
                    </tr>
                </thead>
                <tbody>
                    {dataSearch.map((el,index) => {
                        let columnActions = 0;
                        if (editAction!==null) columnActions++;
                        if (removeAction!==null) columnActions++;
                        if (otherAction!==null) columnActions++;
                        return (
                            <tr 
                                key={`id_${listName}_${el.id}_${index}`} 
                                className={
                                    ((active!==null && active.id==el.id) ? 'selected' : '')+
                                    (selectedAction!==undefined && selectedAction(el) ? ' rowSelected' : '')+
                                    (disabledAction!==undefined && disabledAction(el) ? ' disabled' : '')
                                }
                            >
                                {fields.map(obj => {
                                    const data = obj.split(",");
                                    const dataCheck = data[1].split("|");
                                    return (
                                        <td key={"key_td_"+rand()} className={"td-label-"+dataCheck[0]}>
                                            {actionCell(el,showValue(el,data[1]),data[1]) || showValue(el,data[1])}
                                        </td>
                                    )
                                })}
                                {(editAction!==null || removeAction!==null || otherAction!=null) &&
                                    <td className={"actions actions-buttons-"+columnActions}>
                                        {editAction!==null && <Button className="btn-edit" onClick={() => editAction(el)}><Icon icon="edit" /></Button>}
                                        {removeAction!==null && <Button className="btn-remove" onClick={() => removeAction(el)}><Icon icon="times-circle" /></Button>}
                                        {otherAction!==null && <Button className="btn-other" onClick={() => otherAction.action(el)}>{otherAction.value}</Button>}
                                    </td>
                                }
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {lightbox &&
                <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                    onCloseRequest={() => setLightbox(false)}
                    onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length) }
                    onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length) }
                />
            }
        </>
    )
}

export default DataTable;