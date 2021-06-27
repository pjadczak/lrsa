import React , { useState, useEffect } from 'react';
import TopPanelStyled from './TopPanelStyle';
import { Icon , Badge } from 'rsuite';
import { Link } from "react-router-dom";
import api, { baseUrl , prefixUrl , pathLogout , urlPhotos } from '../../../actions/api';
import { useClickOutside } from 'react-click-outside-hook';
import timeAgo from '../../../actions/timeAgo';
import Truncate from 'react-truncate';

const TopPanel = ({ state, dispatch }) => {

    const [showLayerUser,setShowLayerUser] = useState(false);
    const [showLayerMessages,setShowLayerMessages] = useState(false);
    const [showLayerLogs,setShowLayerLogs] = useState(false);
    const [refUser, hasClickedOutsideUser] = useClickOutside();
    const [refMessages, hasClickedOutsideMessages] = useClickOutside();
    const [refLogs, hasClickedOutsideLogs] = useClickOutside();

    useEffect(() => {
        if (state.userData.show_left_bar!==undefined){
            if (Number(state.userData.show_left_bar) === 0) document.getElementById('frontLayer').classList.add('hideLeftPanel');
            else if (Number(state.userData.show_left_bar) === 10) {
                document.body.classList.remove('shortLeftBar');
            } else if (Number(state.userData.show_left_bar) === 2){
                document.getElementById('frontLayer').classList.remove('hideLeftPanel');
                document.body.classList.add('shortLeftBar');
            } else if (Number(state.userData.show_left_bar) === 9){
                document.getElementById('frontLayer').classList.add('hideLeftPanel');
                document.body.classList.add('shortLeftBar');
            }
        }
        
    },[state.userData.show_left_bar]);

    useEffect(() => {
        if (hasClickedOutsideUser){
            setShowLayerUser(false);
        }
    },[hasClickedOutsideUser]);

    useEffect(() => {
        if (hasClickedOutsideMessages){
            setShowLayerMessages(false);
        }
    },[hasClickedOutsideMessages]);

    useEffect(() => {
        if (hasClickedOutsideLogs){
            setShowLayerLogs(false);
        }
    },[hasClickedOutsideLogs]);

    const handleHamburgerClick = ev => {
        ev.preventDefault();
        // document.body.classList.contains('')
        const frontLayer = document.getElementById('frontLayer');
        const isShort = document.body.classList.contains('shortLeftBar');
        if (frontLayer.classList.contains('hideLeftPanel')){
            frontLayer.classList.remove('hideLeftPanel');
            api('saveShowLeftBar',state.userToken,{ show_left_bar: 1+(isShort ? 9 : 0) });
        } else {
            frontLayer.classList.add('hideLeftPanel');
            api('saveShowLeftBar',state.userToken,{ show_left_bar: 0+(isShort ? 9 : 0) });
        }
    }

    const handleClickUserLayer = event => {
        event.preventDefault();
        setShowLayerUser(v => !v);
    }

    const handleClickMessagesLayer = event => {
        event.preventDefault();
        setShowLayerMessages(v => !v);
    }

    const handleClickLogsLayer = event => {
        event.preventDefault();
        setShowLayerLogs(v => !v);
    }
    const lockScreen = event => {
        event.preventDefault();
        setShowLayerUser(false);
        dispatch({ type: 'IDLE', data: true });
    }

    return (
        <TopPanelStyled>
            <div className="left">
                <ul>
                    <li className="hamburger"><a href="" onClick={ev => handleHamburgerClick(ev)}><Icon icon="bars" /></a></li>
                    {/* <li><Link to={baseUrl}>Dashboard</Link></li> */}
                    {state?.userData.lvl>=4 && <li><Link to={prefixUrl+'users'}>Users</Link></li>}
                    {state?.userData.lvl>=5 && <li><Link to={prefixUrl+'settings'}>Settings</Link></li>}
                </ul>
            </div>
            <div className="right">
                <ul>
                    {state?.userData.lvl>=3 &&
                        <li ref={refLogs}>
                            <a href="" title="Last logs" onClick={ev => handleClickLogsLayer(ev)}>
                                <Badge content={Number(state.lastLogs.length)}><Icon icon="bell-o" /></Badge>
                            </a>
                            <div className={"layerMoreInfo list"+(showLayerLogs ? ' showLayer' : '')}>
                                <label>Last logs</label>
                                {state?.lastLogs.length>0 &&
                                    <ul>
                                        {state?.lastLogs.map(element => (
                                            <li key={`li_logs_top_${element.id}`}>
                                                {timeAgo(element.created_at)} - {element.user_name}
                                                <Truncate lines={1} ellipsis={'...'} width={200} className="content">
                                                    {element.type_operation+((element.value!='' && element.value!=null) ? ' , '+element.value : '')}
                                                </Truncate>
                                            </li>
                                        ))}
                                    </ul>
                                }
                                {state?.lastLogs.length==0 &&
                                    <p className="noRecords">No Logs</p>
                                }
                                <div className="more">
                                        <Link to={prefixUrl+"logs"} onClick={() => setShowLayerLogs(false)}>More <Icon icon="arrow-right-line" /></Link>
                                </div>                            
                            </div>
                        </li>
                    }
                    {state?.userData.lvl>=3 &&
                        <li ref={refMessages}>
                            <a href="" title="Form messages" onClick={ev => handleClickMessagesLayer(ev)}>
                                <Badge content={state?.forms.length}><Icon icon="envelope" /></Badge>
                            </a>
                            <div className={"layerMoreInfo list"+(showLayerMessages ? ' showLayer' : '')}>
                                <label>Messages from the form</label>
                                {state?.forms.length>0 &&
                                    <ul>
                                        {state?.forms.map(element => (
                                            <li key={`li_forms_top_${element.id}`}>
                                                {timeAgo(element.created_at)} - {element.name}
                                                <Truncate lines={1} ellipsis={'...'} width={200} className="content">
                                                    {element.content}
                                                </Truncate>
                                            </li>
                                        ))}
                                    </ul>
                                }
                                {state?.forms.length==0 &&
                                    <p className="noRecords">No unread messages</p>
                                }
                                <div className="more">
                                    <Link to={prefixUrl+"forms"} onClick={() => setShowLayerMessages(false)}>More <Icon icon="arrow-right-line" /></Link>
                                </div>
                            </div>
                        </li>
                    }
                    <li ref={refUser}>
                        <a href="" title="Profil" onClick={ev => handleClickUserLayer(ev)}><Icon icon="user" /></a>
                        <div className={"layerMoreInfo"+(showLayerUser ? ' showLayer' : '')}>
                            <div className="info">
                                <header>
                                    {state?.userData.photo!='' &&
                                        <div className="photo">
                                            <img src={urlPhotos+"small/"+state?.userData.photo} />
                                        </div>
                                    }
                                    {`${state?.userData.name} ${state?.userData.surname}`}
                                    <div className={"role role-"+state?.userData.role}>[{state?.userData.role}]</div>
                                </header>
                                <div className="lastLogin">Last login: <span>{state?.userData.last_login}</span></div>
                            </div>
                            <ul>
                                <li><Link to={prefixUrl+'profile'} onClick={() => setShowLayerUser(false)}><Icon icon="setting" /> Settings</Link></li>
                                <li><a href="" onClick={event => lockScreen(event)}><Icon icon="lock" /> Lock Screen</a></li>
                                <li><Link to={pathLogout} className="logout"><Icon icon="sign-out" /> logout</Link></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </TopPanelStyled>
    );
}
export default TopPanel;