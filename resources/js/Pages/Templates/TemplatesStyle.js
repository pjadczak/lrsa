import styled from 'styled-components';

const TemplatesStyle = styled.div`
    position: relative;
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    header{
        margin-bottom: 20px;
    }
    label{
        text-transform: uppercase;
    }
    .body{
        flex: 1;
    }
    .buttonsLayer{
        flex: 1;
        max-height: 36px;
        .rs-row{
            flex-direction: row;
            .searchButton{
                border-radius: 0px !important;
            }
            flex: 1;
        }
        .rs-col{
            flex: 1;
            text-align: right;
            button{
                /* flex: 1; */
                max-width: 160px;
                width: 160px;
                margin-left: 10px;
            }
        }
    }
`;

export default TemplatesStyle;