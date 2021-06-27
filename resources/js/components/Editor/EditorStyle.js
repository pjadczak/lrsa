import styled from 'styled-components';


const EditorStyle = styled.div`
    flex: 1;
    display: flex;
    height: auto !important;
    .sun-editor{
        flex: 1;
        height: ${props => props.height}px;
    }
`;	

export default EditorStyle;