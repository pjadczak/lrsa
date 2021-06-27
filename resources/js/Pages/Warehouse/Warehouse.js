import React , { useState, useEffect, useContext } from 'react';
import WarehouseStyle from './WarehouseStyle';
import api , { prefixUrl } from '../../actions/api';
import { StateContext } from '../Front/Front';
import { useHistory } from 'react-router-dom';
import DataTable from '../../components/DataTable/DataTable';
import { Pagination , CheckPicker , Button , Icon } from 'rsuite';
import Category from './Category/Category';
import WarehouseMain from './WarehouseMain/WarehouseMain';

const Warehouse = () => {

    const CONTEXT = useContext(StateContext);
    const history = useHistory();
    const [items,setItems] = useState([]);
    const [search,setSearch] = useState('');
    const [categoriesAll,setCategoriesAll] = useState([]);
    const [warehousesAll,setWarehousesAll] = useState([]);
    const [categoriesSelected,setCategoriesSelected] = useState([]);
    const [categories,setCategories] = useState([]);
    const [warehouses,setWarehouses] = useState([]);
    const [counterRead,setCounterRead] = useState(0);

    const [pagCurrent,setPagCurrent] = useState(1);
    const [pagePages,setPagePages] = useState(10);
    const [pageParts,setPageParts] = useState(10);

    const [categoryId,setCategoryId] = useState(null);
    const [warehouseId,setWarehouseId] = useState(null);

    const [MIN_ACCESS_WAREHOUSE_LVL,SET_MIN_ACCESS_WAREHOUSE_LVL] = useState(100);

    useEffect(() => {
        CONTEXT.setBread([{ label: 'Warehouse item\'s list' } ]);
        CONTEXT.setActions([
            {
                type: 'search',
                label: 'Search',
                action: searchAction,
            },
            {
                type: 'add',
                label: 'Create new item',
                action: addItem,
            },
            (
                CONTEXT.userData.lvl>=MIN_ACCESS_WAREHOUSE_LVL ?
                {
                    type: 'other',
                    title: 'Create new warehouse',
                    action: addWarehouse,
                    icon: <Icon icon="plus-circle" />,
                    cssClass: 'btn-grey'
                } : null
            ),
            {
                type: 'other',
                title: 'Add category\'s item',
                action: addCategory,
                icon: <Icon icon="plus-square" />
            },
        ]);
    },[MIN_ACCESS_WAREHOUSE_LVL]);

    useEffect(() => {
        readData();
    },[counterRead,pagCurrent,search,categories,warehouses]);

    const readData = () => {
        const dataSend = {
            pagCurrent,
            search,
            categories,
            warehouses
        }
        CONTEXT.setLoading(true);
        api('getListWarehouse',CONTEXT.userToken,dataSend,r => {
            CONTEXT.setLoading(false);
            if (r.result){
                setItems(r.data.items);
                setCategoriesAll(r.data.categories);
                setWarehousesAll(r.data.warehouses);
                if (r.data.items_count!==null){
                    setPagePages(r.data.items_count);
                }
                if (r.data.parts!==null){
                    setPageParts(r.data.parts);
                }
                SET_MIN_ACCESS_WAREHOUSE_LVL(r.data.MIN_ACCESS_WAREHOUSE_LVL);
            }
        });
    }

    const addCategory = () => {
        setCategoryId(0);
    }

    const addWarehouse = () => {
        setWarehouseId(0);
    }

    const searchAction = (s) => {
        setSearch(s);
    }

    const addItem = () => {
        history.push(prefixUrl+"warehouse/0");
    }

    const editAction = (obj) => {
        history.push(prefixUrl+"warehouse/"+obj.id);
    }

    return (
        <WarehouseStyle>
            {categoryId!==null && <Category setCategoryId={setCategoryId} setCategoriesAll={setCategoriesAll} categoriesAll={categoriesAll} />}
            {(warehouseId!==null && CONTEXT.userData.lvl>=MIN_ACCESS_WAREHOUSE_LVL) && <WarehouseMain setWarehouseId={setWarehouseId} setWarehousesAll={setWarehousesAll} warehousesAll={warehousesAll} />}
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
                <CheckPicker 
                    data={warehousesAll.map(obj => {
                        return { value: obj.id, label: obj.name }
                    })} 
                    onSelect={data => setWarehouses(data)}
                    onClean={() => setWarehouses([])}
                    placeholder="Choose warehouse"
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
                data={items}
                fields={['ID,id','Name,name','Warehouse,warehouseName','Actions,warehouseCount','Last action,lastActionName','Creation date,dateAdd']}
                editAction={editAction}
                disabledAction={el => el.disabled}
            />
        </WarehouseStyle>
    );
}
export default Warehouse;