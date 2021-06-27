import styled from 'styled-components';

const PhotoStyle = styled.div`
    height: 200px;
    background-color: white;
    border: 1px solid #d1d1d1;
    position: relative;
    background-position: top center;
    background-size: cover;
    &.photo-bg{
        height: 48px;
    }
    .plus{
        position: absolute;
        bottom: 5px;
        right: 5px;
        background-color: #9be51c;
        &:hover{
            background-color: #78B116;
        }
    }
    .trash{
        position: absolute;
        bottom: 5px;
        right: 46px;
    }
    .image{
        position: absolute;
        bottom: 5px;
        right: 87px;
        &.imageOnly{
            right: 5px;
        }
    }
`;

export default PhotoStyle;