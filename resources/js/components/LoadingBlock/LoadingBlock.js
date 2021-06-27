import React from 'react';
import StyledContentLoader from 'styled-content-loader'

const LoadingBlock = () => {

    return (
        <StyledContentLoader backgroundColor={"#f5f5f5"} foregroundColor={"#ededed"}>
            <span>⌛</span>
            <br />
            <p style={{ width: '90%' }}>
                The simplest solution for content loading in React and styled-components.
            </p>
            <p style={{ width: '80%' }}>
                The simplest solution for content loading in React and styled-components.
            </p>
            <p style={{ width: '60%' }}>
                The simplest solution for content loading in React and styled-components.
            </p>
            <p style={{ width: '70%' }}>
                The simplest solution for content loading in React and styled-components.
            </p>
            <p>
                The simplest solution for content loading in React and styled-components.
            </p>
            <p style={{ width: '80%' }}>
                The simplest solution for content loading in React and styled-components.
            </p>
            <p style={{ width: '60%' }}>
                The simplest solution for content loading in React and styled-components.
            </p>
            <p style={{ width: '70%' }}>
                The simplest solution for content loading in React and styled-components.
            </p>
            <p>
                The simplest solution for content loading in React and styled-components.
            </p>
        </StyledContentLoader>  
    )
}

export default LoadingBlock;