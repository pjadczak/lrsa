import styled from 'styled-components';
import { panelLeftWidth } from '../../actions/variables';

const FrontStyle = styled.div`
    width: 100vw;
    flex: 1;
    .leftPanel{
        max-width: ${panelLeftWidth}px;
        width: ${panelLeftWidth}px;
        background-color: var(--leftPanelBg);
        position: fixed;
        top: 0px;
        left: 0px;
        height: 100vh;
        z-index: 1000;
        overflow: hidden;
        transition: all .3s ease .1s;
    }
    .rightPanel{
        margin-left: ${panelLeftWidth}px;
        transition: all .3s ease .2s;
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100vh;
    }
    &.hideLeftPanel{
        .leftPanel{
            left: -${panelLeftWidth}px;
        }
        .rightPanel{
            margin-left: 0px;
        }
    }
`;	

export default FrontStyle;