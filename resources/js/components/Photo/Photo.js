import React , { useState , useEffect } from 'react';
import { Icon , IconButton } from 'rsuite';
import Dropzone from 'react-dropzone';
import Lightbox from 'react-image-lightbox';
import Confirm from '../Confirm/Confirm';
import api , { API_FILE , urlPhotos } from '../../actions/api';
import PhotoStyle from './PhotoStyle';
import { alert } from '../../actions/Functions';

const Photo = ({ CONTEXT , urlAppend , urlRemove , photo , setPhoto , readPhotoField , saveData , height , disabled }) => {

    const [lightbox,setLightbox] = useState(false);
    const [images,setImages] = useState([]);
    const [photoIndex,setPhotoIndex] = useState(0);
    const [showRemovePhoto,setShowRemovePhoto] = useState(false);
    const [loadingImage,setLoadingImage] = useState(false);
    const [styleInline,setStyleInline] = useState({});

    const appendFile = file => {
        setLoadingImage(true);
        API_FILE(urlAppend, file, CONTEXT.userToken, r => {
            setLoadingImage(false);
            if (r.result){
                setPhoto(r.data[ readPhotoField==undefined ? 'photo' : readPhotoField ]);
                alert(r.data.comm,'success');
                if (saveData!==undefined){
                    saveData(r.data.userData);
                }
            } else {
                alert(r.comm,'error');
            }
        });
    }

    const removePhoto = () => {
        setShowRemovePhoto(false);
        if (urlRemove === null) {
            setPhoto('');
        } else {
            CONTEXT.setLoading(true);
            api(urlRemove, CONTEXT.userToken, {}, r => {
                CONTEXT.setLoading(false);
                if (r.result){
                    setPhoto('');
                    alert(r.comm,"warning");
                    if (saveData!==undefined){
                        saveData(r.data.userData);
                    }
                } else {
                    alert(r.comm,"error");
                }
            });
        }
    }

    useEffect(() => {
        const _style = {};
        if (photo!='' && photo!=null){
            _style.backgroundImage = "url("+urlPhotos+photo+")";
        }
        if (height!==undefined){
            _style.height = height+'px';
        }
        setStyleInline(_style);

    },[photo,height]);

    return (
        <PhotoStyle style={styleInline} className={"photo-box"+(loadingImage ? ' loadingLayer' : '')}>

            {!Boolean(disabled) &&
                <Dropzone onDrop={acceptedFiles => appendFile(acceptedFiles[0])} accept={"image/png,image/jpeg"}  maxSizeBytes={10485760}>
                    {({getRootProps, getInputProps}) => {
                        return (
                            <div {...getRootProps()} className="dropZone">
                                <input {...getInputProps()} />
                                <IconButton className="plus" icon={<Icon icon="plus" />} appearance="primary" />
                            </div>
                        )
                    }}
                </Dropzone>
            }

            {(photo!='' && photo!=null && !Boolean(disabled)) && <IconButton className="trash" icon={<Icon icon="trash" />} onClick={() => {
                setShowRemovePhoto(true);
            }} />}
            {(photo!='' && photo!=null) && <IconButton className={"image"+(disabled ? ' imageOnly' : '')} icon={<Icon icon="image" />} onClick={() => {
                setImages([urlPhotos+photo]);
                setLightbox(true);
            }} />}

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
            <Confirm show={showRemovePhoto} setShow={setShowRemovePhoto} buttonOk="Usuń" content="Czy na pewno usunąć to zdjęcie?" callBack={() => removePhoto()} />

        </PhotoStyle>
    )
}

export default Photo;