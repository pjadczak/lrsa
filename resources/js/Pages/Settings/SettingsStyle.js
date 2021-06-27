import styled from 'styled-components';


const SettingsStyle = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    .rs-row{
        .rs-col{
            label{
                display: block;
                margin-bottom: 15px;
                span{
                    color: grey;
                    font-style: italic;
                }
            }
            .rs-slider{
                position: relative;
                top: 5px;
            }
        }
    }
`;	

export default SettingsStyle;