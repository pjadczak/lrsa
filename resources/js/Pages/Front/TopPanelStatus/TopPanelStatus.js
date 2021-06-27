import React, { useEffect, useState } from 'react';
import TopPanelStatusStyle from './TopPanelStatusStyle';
import { Link } from "react-router-dom";
import { baseUrl , prefixUrl } from '../../../actions/api';
import { Icon, Button , InputGroup , Input } from 'rsuite';

const TopPanelStatus = ({ actions , bread , loading }) => {

    const [search,setSearch] = useState('');

    const buildActions = () => {
        if (actions!==null){
            return actions.filter(obj => obj!==null).map((obj,index) => {
                const label = setLabelValue(obj);
                return (
                    <li key={`li_Actions_${index}`} className={obj.type}>
                        {buildActionLayer(obj,label)}
                    </li>
                )
            });
        }
    }

    const buildActionLayer = (obj,label) => {
        switch (obj.type){
            case 'save': case 'change': return (
                <>
                    <Button size="sm" onClick={obj.action} appearance={"primary"+(obj?.cssClass ? ' '+obj.cssClass : '')} title={obj.title!==undefined ? obj.title : null}>
                        {obj?.icon==undefined ? <Icon icon="save" /> : obj.icon} {label}
                    </Button>
                </>
            )
            case 'delete': case 'remove': return (
                <>
                    <Button size="sm" onClick={obj.action} className={"remove"+(obj?.cssClass ? ' '+obj.cssClass : '')} appearance="default" title={obj.title!==undefined ? obj.title : null}>
                        {obj?.icon==undefined ? <Icon icon="times-circle" /> : obj.icon} {label}
                    </Button>
                </>
            )
            case 'add': case 'new': case 'insert': return (
                <>
                    <Button size="sm" onClick={obj.action} className={"add"+(obj?.cssClass ? ' '+obj.cssClass : '')} color="green" title={obj.title!==undefined ? obj.title : null}>
                        {obj?.icon==undefined ? <Icon icon="times-circle" /> : obj.icon} {label}
                    </Button>
                </>
            )
            case 'back': return (
                <>
                    <Button size="sm" onClick={obj.action} className={"back"+(obj?.cssClass ? ' '+obj.cssClass : '')} color="green" title={obj.title!==undefined ? obj.title : null}>
                        {obj?.icon==undefined ? <Icon icon="back-arrow" /> : obj.icon}
                    </Button>
                </>
            )
            case 'other': return (
                <>
                    <Button size="sm" onClick={obj.action} className={"other"+(obj?.cssClass ? ' '+obj.cssClass : '')} color="orange" title={obj.title!==undefined ? obj.title : label}>
                        {obj?.icon==undefined ? <Icon icon="gear" /> : obj.icon} {String(label)!=='' ? label : ''}
                    </Button>
                </>
            )
            case 'search': return (
                <>
                    <InputGroup inside className={(obj?.cssClass ? ' '+obj.cssClass : '')}>
                        <Input 
                            size="sm" 
                            value={search} 
                            onKeyDown={key => key.keyCode==13 ? obj.action(search) : null}
                            placeholder={obj.placeholder!==undefined ? obj.placeholder : null}
                            onChange={v => setSearch(v)} 
                        />
                        <InputGroup.Button size="xs" size="sm" onClick={() => obj.action(search)}>
                            <Icon icon="search" /> {label}
                        </InputGroup.Button>
                    </InputGroup>
                </>
            )
        }
    }

    const buildBread = () => {
        if (bread!==null){
            return bread.map((obj,index) => {
                return (
                    <li key={`li_Bread_${index}`}>
                        {
                            obj.path !== undefined ? 
                                <Link to={obj.path}>{obj.label}</Link> 
                            :
                                <>{obj.label}</>
                            }
                    </li>
                )
            });
        }
    }

    return (
        <TopPanelStatusStyle className={loading ? 'loading' : ''}>
            <div className="Main-Breadcrumb">
                <ul>
                    <li><Link to={baseUrl}>HOME</Link></li>
                    {buildBread()}
                </ul>
            </div>
            <div className="operations">
                <ul>
                    {buildActions()}
                </ul>
            </div>
        </TopPanelStatusStyle>
    );
}

const setLabelValue = (el) => {
    if (el.label === undefined){
        switch (el.type){
            case 'save': case 'change': return 'Save';
            case 'add': case 'new': case 'new': return 'Add new';
            case 'delete': case 'remove': return 'Remove';
            // case 'other': return 'Wykonaj';
            case 'search': return 'Search';
            case 'back': return 'Back';
        }
    }
    return el.label;
}

export default TopPanelStatus;