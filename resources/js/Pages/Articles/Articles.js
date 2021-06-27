import React , { useState, useEffect, useContext } from 'react';
import ArticlesStyle from './ArticlesStyle';
import api , { prefixUrl } from '../../actions/api';
import { StateContext } from '../Front/Front';
import DataTable from '../../components/DataTable/DataTable';
import { Pagination , CheckPicker , Button } from 'rsuite';
import { useHistory } from 'react-router-dom';

const Articles = () => {

    const CONTEXT = useContext(StateContext);
    const history = useHistory();
    const [articles,setArticles] = useState([]);
    const [counterRead,setCounterRead] = useState(0);
    const [search,setSearch] = useState('');
    const [categoriesAll,setCategoriesAll] = useState([]);
    const [categoriesSelected,setCategoriesSelected] = useState([]);
    const [categories,setCategories] = useState([]);

    const [pagCurrent,setPagCurrent] = useState(1);
    const [pagePages,setPagePages] = useState(10);
    const [pageParts,setPageParts] = useState(10);

    useEffect(() => {
        CONTEXT.setBread([{ label: 'Articlle\'s list' } ]);
        CONTEXT.setActions([
            {
                type: 'search',
                label: 'Search',
                action: searchAction
            },
            {
                type: 'add',
                label: 'Create new article',
                action: addAction
            },
        ]);
    },[]);

    useEffect(() => {
        readData();
    },[counterRead,pagCurrent,search,categories]);

    const searchAction = value => {
        setPagCurrent(1);
        setSearch(value);
    }

    const readData = () => {
        const dataSend = {
            pagCurrent,
            search,
            categories
        }
        CONTEXT.setLoading(true);
        api('getArticleModeratorList',CONTEXT.userToken,dataSend,r => {
            CONTEXT.setLoading(false);
            if (r.result){
                setArticles(r.data.articles);
                setCategoriesAll(r.data.categories);
                if (r.data.articles_count!==null){
                    setPagePages(r.data.articles_count);
                }
                if (r.data.parts!==null){
                    setPageParts(r.data.parts);
                }
            }
        });
    }

    const editAction = (obj) => {
        history.push(prefixUrl+"articles/"+obj.id);
    }

    const addAction = () => {
        history.push(prefixUrl+"articles/0");
    }

    const handleCellAction = (ev,obj) => {
        ev.preventDefault();
        history.push(prefixUrl+"articles/"+obj.id);
    }

    return (
        <ArticlesStyle>
            <div className="filters">
                <CheckPicker 
                    data={categoriesAll.map(obj => {
                        return { value: obj.id, label: obj.name }
                    })} 
                    onSelect={data => setCategoriesSelected(data)}
                    onClean={() => setCategoriesSelected([])}
                    placeholder="Choose category"
                    searchable={false}
                />
                <Button appearance="primary" onClick={() => setCategories(categoriesSelected)}>Filter</Button>
            </div>
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
                data={articles}
                fields={['ID,id','Title,title','Author,author','Categories,listCategories','Number of openings,read_counter|nr','Image,photo|photo','Creation date,date']}
                editAction={editAction}
                actionCell={(obj,text,field) => (field==='title' || field==='id') ? <a onClick={ev => handleCellAction(ev,obj)} href="#">{text}</a> : null}
                disabledAction={obj => !Boolean(obj.active)}
            />
        </ArticlesStyle>
    );
}
export default Articles;