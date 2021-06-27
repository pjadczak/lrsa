import React from 'react';
import SunEditor from 'suneditor-react';
import EditorStyle from './EditorStyle';

const Editor = ({ content , setContent, height = 200 , onFocusHandler , lessIcons = false , name = null }) => {

    let buttonList = [ ['undo', 'redo'] , ['formatBlock'] , ['bold', 'underline', 'italic'] , ['fontColor', 'hiliteColor', 'textStyle'] , ['fullScreen', 'showBlocks', 'codeView']];
    if (lessIcons){
        buttonList = [ ['bold', 'italic'] , ['fontColor', 'hiliteColor'] , ['fullScreen', 'codeView']];
    }

    return (
        <EditorStyle height={height}>
            <SunEditor 
                value={content}
                name={name}
                setContents={content}
                lang="pl"
                // autoFocus={true}
                onChange={setContent}
                pasteTagsWhitelist={'strong'} 
                // onPaste={(e, cleanData, maxCharCount) => { return false }}
                onFocus={typeof onFocusHandler === 'function' ? onFocusHandler : null}
                setOptions={{
                    // height,
                    buttonList
                }}
            />
        </EditorStyle>
    )
}

export default Editor;