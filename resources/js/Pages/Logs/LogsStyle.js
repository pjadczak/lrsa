import styled from 'styled-components';

const LogsStyle = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    .filters{
        margin-bottom: 20px;
    }
    .rs-pagination{
        position: absolute;
        top: -10px;
        right: 10px;
    }
`;	

export default LogsStyle;