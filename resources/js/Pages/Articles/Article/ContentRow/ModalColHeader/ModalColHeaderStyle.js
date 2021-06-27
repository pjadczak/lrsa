import styled from 'styled-components';


const ModalColHeaderStyle = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    .rs-row{
        margin-left: 0px;
        margin-right: 0px;
    }
    .header{
        padding: 10px 15px 15px 15px;
        background-color: #f7f7f7;
        border: 1px solid #e6e6e6;
        label{
            display: block;
            color: grey;
        }
    }
`;	

export default ModalColHeaderStyle;