import React from 'react';
import Dropzone from 'react-dropzone';
import { API_FILE } from '../../actions/api';
import { alert } from '../../actions/Functions';
import { IconButton , Icon } from 'rsuite';

const Upload = ({ STATE, url , setFile , successAction , accept , beforeAction , afterAction }) => {

    const appendFile = file => {
        STATE.setLoading(true);
        if (beforeAction!==undefined) beforeAction();
        API_FILE(url, file, STATE.userData.token, r => {
            STATE.setLoading(false);
            if (afterAction!==undefined) afterAction();
            if (r.result){
                if (setFile!==undefined) setFile(r.data.file);
                if (successAction!==undefined) successAction(r);
                alert(r.data.comm,'success',((r.commTime!==undefined && r.commTime>0) ? r.commTime : null));
            } else {
                alert(r.comm,'error',((r.commTime!==undefined && r.commTime>0) ? r.commTime : null));
            }
        });
    }

    return (
        <Dropzone onDrop={acceptedFiles => appendFile(acceptedFiles[0])} accept={accept===undefined ? '.gpx,.tcx' : accept}  maxSizeBytes={10485760}>
            {({getRootProps, getInputProps}) => {
                return (
                    <div {...getRootProps()} className="dropZone">
                        <input {...getInputProps()} />
                        <IconButton className="plus" icon={<Icon icon="plus" />} appearance="primary" />
                    </div>
                )
            }}
        </Dropzone>
    )
}

export default Upload;