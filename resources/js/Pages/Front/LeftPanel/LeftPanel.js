import React , { useEffect , useState } from 'react';
import LeftPanelStyle from './LeftPanelStyle';
import logo from '../../../assets/images/logo.png';
import logoShort from '../../../assets/images/logo_short.png';
import { Link , useLocation } from "react-router-dom";
import { prefixUrl } from '../../../actions/api';
import { Icon } from 'rsuite';
import api from '../../../actions/api';

const LeftPanel = ({ state }) => {

    let location = useLocation();
    const [actual,setActual] = useState(location.pathname);

    useEffect(() => {
        setActual(location.pathname);
    },[location]);

    const clickHandleMenuSumbenu = event => {
        if (event.target.parentNode.classList.contains('hasMenu') && !event.target.parentNode.classList.contains('showSubmenu')){
            event.target.parentNode.classList.add("showSubmenu");
        } else if (event.target.parentNode.parentNode.classList.contains('hasMenu') && !event.target.parentNode.parentNode.classList.contains('showSubmenu')){
            event.target.parentNode.parentNode.classList.add("showSubmenu");
        } else if (event.target.parentNode.classList.contains('showSubmenu')){
            event.target.parentNode.classList.remove("showSubmenu");
        } else if (event.target.parentNode.parentNode.classList.contains('showSubmenu')){
            event.target.parentNode.parentNode.classList.remove("showSubmenu");
        }
    }

    const handleClickShortPanel = event => {
        event.preventDefault();
        const isHide = document.getElementById('frontLayer').classList.contains('hideLeftPanel');
        console.log('isShow: ',isHide);
        if (document.body.classList.contains("shortLeftBar")){
            document.body.classList.remove("shortLeftBar");
            api('saveShowLeftBar',state.userToken,{ show_left_bar: 9 + (isHide ? 0 : 1 ) });
        } else {
            document.body.classList.add("shortLeftBar");
            api('saveShowLeftBar',state.userToken,{ show_left_bar: 0 + (isHide ? 0 : 2 ) });
        }
    }

    return (
        <LeftPanelStyle>
            <div className="logo">
                <img src={logo} className="logo_full" />
                <img src={logoShort} className="logo_short" />
            </div>
            <div className="content">
                {/* <div className="dashboard">
                    <ul>
                        <li>
                            <Link to={prefixUrl}><Icon icon="dashboard" /> <span>Dashboard</span></Link>
                        </li>
                    </ul>
                </div> */}
                <div className="menu">
                    <label>Menu</label>
                    <ul>
                        {/* <li className="hasMenu" onClick={(event) => clickHandleMenuSumbenu(event)}>
                            <a href="" onClick={(event) => event.preventDefault()}><Icon icon="setting" /> <span>Ustawienia</span></a>
                            <ul>
                                <li><Link to={prefixUrl+"settings"}><span>Ustawienia</span></Link></li>
                                <li><Link to={prefixUrl+"settings"}><span>Ustawienia</span></Link></li>
                                <li><Link to={prefixUrl+"settings"}><span>Ustawienia</span></Link></li>
                                <li><Link to={prefixUrl+"settings"}><span>Ustawienia</span></Link></li>
                            </ul>
                        </li> */}
                        {state.userData.lvl>=4 &&
                            <li className={actual.indexOf('/users')>=0 ? 'active' : ''}>
                                <Link to={prefixUrl+"users"}><Icon icon="people-group" /> <span>Users</span></Link>
                            </li>
                        }
                        <li className={actual.indexOf('/articles')>=0 ? 'active' : ''}>
                            <Link to={prefixUrl+"articles"}><Icon icon="newspaper-o" /> <span>Articles</span></Link>
                        </li>
                        {state.userData.lvl>=3 &&
                            <li className={actual.indexOf('/forms')>=0 ? 'active' : ''}>
                                <Link to={prefixUrl+"forms"}><Icon icon="order-form" /> <span>Application forms</span></Link>
                            </li>
                        }
                        {state.userData.lvl>=5 &&
                            <li className={actual.indexOf('/templates')>=0 ? 'active' : ''}>
                                <Link to={prefixUrl+"templates"}><Icon icon="envelope" /> <span>E-mail templates</span></Link>
                            </li>
                        }
                        {state.userData.lvl>=3 &&
                            <li className={actual.indexOf('/warehouse')>=0 ? 'active' : ''}>
                                <Link to={prefixUrl+"warehouse"}><Icon icon="server" /> <span>Warehouse</span></Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
            <div className="bottom" onClick={ev => handleClickShortPanel(ev)}>
                <a href=""></a>
            </div>
            
        </LeftPanelStyle>
    );
}
export default LeftPanel