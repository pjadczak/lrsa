import styled from 'styled-components';

const ConfirmStyle = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    .content{
        text-align: center; 
        margin-bottom: 10px; 
        top: -20px;
        position: relative;
        .image{
            margin: 20px 0px;
            text-align: center;
            img{
                max-width: 400px;
                max-height: 250px;
            }
        }
    }
`;	

export default ConfirmStyle;