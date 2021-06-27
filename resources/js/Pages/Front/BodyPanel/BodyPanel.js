import React , { useState, useEffect, useContext } from 'react';
import BodyPanelStyle from './BodyPanelStyle';
import RoutingLogged from '../../../Routing/RoutingLogged';

const BodyPanel = () => {

    return (
        <BodyPanelStyle>
            <RoutingLogged />
        </BodyPanelStyle>
    );
}
export default BodyPanel;