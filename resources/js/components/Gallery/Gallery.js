import React , { useState, useEffect, useContext } from 'react';
import GalleryStyle from './GalleryStyle';
import { Icon } from 'rsuite';
import Dropzone from 'react-dropzone';
import { urlPhotos , API_FILE } from '../../actions/api';
import { ReactSortable } from "react-sortablejs";
import Confirm from '../Confirm/Confirm';
import Lightbox from 'react-image-lightbox';

const Gallery = ({ CONTEXT , photos , setPhotos , urlAppend }) => {

    const [dragOver,setDragOver] = useState(false);
    const [photosLocal,setPhotosLocal] = useState([]);
    const [showModal,setShowModal] = useState(false);
    const [modalData,setModalData] = useState(null);
    const [modalLabel,setModalLabel] = useState('');
    const [loadingImage,setLoadingImage] = useState(false);
    const [uploadPercent,setUploadPercent] = useState(-1);
    const [uloadDone,setUploadDone] = useState(false);

    const [imagesLightbox,setImagesLightBox] = useState(null);
    const [photoIndex,setPhotoIndex] = useState(0);

    useEffect(() => {
        if (photos!==null && photos!==undefined){
            setPhotosLocal(photos.map((obj,index) => {
                return { id: index, name: obj.photo , label: obj.label }
            }));
        }
    },[photos]);

    /*
     * Upload files
     **/
    const appendFiles = files => {
        let index = 0;
        let uploadsPhotos = [];
        setUploadPercent(0);
        files.forEach(file => {
            setLoadingImage(true);
            API_FILE(urlAppend, file, CONTEXT.userToken, r => {
                setLoadingImage(false);
                if (r.result){
                    uploadsPhotos.push({ photo: r.data.photo, label: '' });
                    index++;
                    setUploadPercent(Math.ceil(index * 100 / files.length));
                    if (index>=files.length){
                        setPhotos([...photos,...uploadsPhotos]);
                        setUploadDone(true);
                        setUploadPercent(-1);
                    }
                } else {
                    console.error(r.comm);
                }
            });
        });
    }

    const handleClickPhoto = obj => {
        setModalLabel(obj.label);
        setModalData(obj);
        setShowModal(true);
    }

    const saveModalData = () => {
        console.log("Zapis");
        setPhotos(photos.map(obj => {
            if (obj.photo == modalData.name){
                obj.label = modalLabel;
            }
            return obj;
        }));
        setShowModal(false);
    }
    const removeModalData = () => {
        setPhotos(photos.filter(obj => obj.photo!=modalData.name));
        setShowModal(false);
    }

    return (
        <GalleryStyle>
            {(photos!==null && photos!==undefined && photos.length>0) &&
                <div className="gallery">
                    <ReactSortable list={photosLocal} setList={setPhotosLocal} onEnd={() => setPhotos(photosLocal.map(obj => {
                        return { photo: obj.name , label: obj.label }
                    }))} className="sortGallery">
                        {photosLocal.map((obj,index) => (
                            <div className="image" key={`drag_gallery_${index}`} onClick={() => handleClickPhoto(obj)}>
                                <img src={urlPhotos+'small/'+obj.name} />
                            </div>
                        ))}
                    </ReactSortable>
                </div>
            }
            
            <Dropzone 
                onDrop={acceptedFiles => appendFiles(acceptedFiles)} 
                onEnd={() => console.log("end")}
                accept={"image/png,image/jpeg"}  
                maxSizeBytes={10485760}
                onDragOver={() => setDragOver(true)}
                onDragLeave={() => setDragOver(false)}
            >
                {({getRootProps, getInputProps}) => {
                    return (
                        <div {...getRootProps()} className={"dropZone"+(dragOver ? ' drag' : '')}>
                            {uploadPercent>=0 && <div className="percent"><div style={{ width: uploadPercent+'%' }}></div></div>}
                            <input {...getInputProps()} />
                            <div className="infoDrop">Click here or Drag'and'Drop</div>
                            <Icon icon="upload" size="5x" />
                        </div>
                    )
                }}
            </Dropzone>
            {showModal &&
                <Confirm 
                    show={showModal}
                    setShow={setShowModal}
                    buttonOk="Usuń zdjęcie"
                    buttonOkColor={"red"}
                    callBack={removeModalData}
                    fSave={saveModalData}
                    image={urlPhotos+'small/'+modalData.name}
                    setImageLightbox={() => setImagesLightBox([urlPhotos+modalData.name])}
                    inputValue={modalLabel}
                    setInputValue={setModalLabel}
                    inputPlaceholder={"Podpis zdjęcia"}
                    showIco={false}
                />
            }
            {(imagesLightbox!==null && imagesLightbox.length>0) &&
                <Lightbox
                    mainSrc={imagesLightbox[photoIndex]}
                    nextSrc={imagesLightbox[(photoIndex + 1) % imagesLightbox.length]}
                    prevSrc={imagesLightbox[(photoIndex + imagesLightbox.length - 1) % imagesLightbox.length]}
                    onCloseRequest={() => setImagesLightBox(null)}
                    onMovePrevRequest={() => setPhotoIndex((photoIndex + imagesLightbox.length - 1) % imagesLightbox.length) }
                    onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % imagesLightbox.length) }
                />
            }
        </GalleryStyle>
    );
}
export default Gallery;