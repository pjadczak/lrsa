import React from 'react';
import { Switch , Route } from 'react-router-dom';
import { prefixUrl } from '../actions/api';
import Profile from '../Pages/Profile/Profile';
import Users from '../Pages/Users/Users';
import User from '../Pages/Users/User/User';
import Templates from '../Pages/Templates/Templates';
import Template from '../Pages/Templates/Template/Template';
import Articles from '../Pages/Articles/Articles';
import Article from '../Pages/Articles/Article/Article';
import Forms from '../Pages/Forms/Forms';
import Logs from '../Pages/Logs/Logs';
import Settings from '../Pages/Settings/Settings';
import Warehouse from '../Pages/Warehouse/Warehouse';
import WarehouseItem from '../Pages/Warehouse/Item/Item';

const RoutingLogged = props => {
    return (
        <>
            <Switch>
                <Route exact path={prefixUrl+"profile"}>
                    <Profile />
                </Route>
                <Route exact path={prefixUrl+"users"}>
                    <Users />
                </Route>
                <Route exact path={prefixUrl+"users/:id"}>
                    <User />
                </Route>
                <Route exact path={prefixUrl+"templates"}>
                    <Templates />
                </Route>
                <Route exact path={prefixUrl+"templates/:id"}>
                    <Template />
                </Route>
                <Route exact path={prefixUrl+"articles"}>
                    <Articles />
                </Route>
                <Route exact path={prefixUrl+"articles/:id"}>
                    <Article />
                </Route>
                <Route exact path={prefixUrl+"forms"}>
                    <Forms />
                </Route>
                <Route exact path={prefixUrl+"logs/:objs?/:dates?"}>
                    <Logs />
                </Route>
                <Route exact path={prefixUrl+"settings"}>
                    <Settings />
                </Route>
                <Route exact path={prefixUrl+"warehouse"}>
                    <Warehouse />
                </Route>
                <Route exact path={prefixUrl+"warehouse/:id"}>
                    <WarehouseItem />
                </Route>
            </Switch>
        </>
    )
}

export default RoutingLogged;