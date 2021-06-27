import React , { useState, useEffect, useContext } from 'react';
import UsersStyle from './UsersStyle';
import api , { prefixUrl } from '../../actions/api';
import { StateContext } from '../Front/Front';
import DataTable from '../../components/DataTable/DataTable';
import { Pagination } from 'rsuite';
import { useHistory } from 'react-router-dom';

const Users = () => {

    const CONTEXT = useContext(StateContext);
    const history = useHistory();
    const [users,setUsers] = useState([]);
    const [counterRead,setCounterRead] = useState(0);
    const [search,setSearch] = useState('');

    const [pagCurrent,setPagCurrent] = useState(1);
    const [pagePages,setPagePages] = useState(10);
    const [pageParts,setPageParts] = useState(10);

    useEffect(() => {
        CONTEXT.setBread([{ label: 'User list' } ]);
        CONTEXT.setActions([
            {
                type: 'search',
                label: 'Search',
                action: searchAction
            },
            {
                type: 'add',
                label: 'Add new user',
                action: addAction
            },
        ]);
    },[]);

    useEffect(() => {
        readData();
    },[counterRead,pagCurrent,search]);

    const searchAction = (value) => {
        setPagCurrent(1);
        setSearch(value);
    }

    const readData = () => {
        const dataSend = {
            pagCurrent,
            search
        }
        CONTEXT.setLoading(true);
        api('getUsers',CONTEXT.userToken,dataSend,r => {
            CONTEXT.setLoading(false);
            if (r.result){
                setUsers(r.data.users);
                if (r.data.users_count!==null){
                    setPagePages(r.data.users_count);
                }
                if (r.data.parts!==null){
                    setPageParts(r.data.parts);
                }
            }
        });
    }

    const editAction = (obj) => {
        history.push(prefixUrl+"users/"+obj.id);
    }

    const addAction = () => {
        history.push(prefixUrl+"users/0");
    }

    return (
        <UsersStyle>
            {pagePages>pageParts &&
                <Pagination 
                    pages={Math.ceil(pagePages/pageParts)}
                    activePage={pagCurrent}
                    onSelect={obj => setPagCurrent(obj)}
                    maxButtons={5}
                    size="md"
                    first
                    last
                />
            }
            <DataTable 
                data={users}
                // headers={['ID','Imię i nazwisko','E-mail','Rola','']}
                fields={['ID,id','Name & surname,name','E-mail,email','Role,roleName','Avatar,photo|photo']}
                editAction={editAction}
                disabledAction={obj => !Boolean(obj.active)}
                // removeAction={removeAction}
                // otherAction={{ action: otherAction, value: <Icon icon="check-circle" /> }}
            />
        </UsersStyle>
    );
}
export default Users;