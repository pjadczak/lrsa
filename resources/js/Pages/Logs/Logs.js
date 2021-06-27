import React , { useState, useEffect, useContext } from 'react';
import LogsStyle from './LogsStyle';
import api , { prefixUrl } from '../../actions/api';
import { StateContext } from '../Front/Front';
import { toIsoDate , stringToDate } from '../../actions/Functions';
import DataTable from '../../components/DataTable/DataTable';
import { Pagination , CheckPicker , Button , DateRangePicker } from 'rsuite';
import { useHistory , useParams } from 'react-router-dom';

const rangeDateDefault = [new Date(new Date().setDate(new Date().getDate()-7)),new Date()]

const Logs = () => {

    const CONTEXT = useContext(StateContext);
    const history = useHistory();
    const { objs:paramObjs , dates:paramDates } = useParams();
    const [logs,setLogs] = useState([]);
    const [search,setSearch] = useState('');
    const [objsAll,setObjsAll] = useState([]);
    const [objsSelected,setObjsSelected] = useState([]);
    const [objs,setObjs] = useState([]);
    const [dates,setDates] = useState(rangeDateDefault);
    const [dateStart,setDateStart] = useState(null);
    const [dateEnd,setDateEnd] = useState(null);

    const [pagCurrent,setPagCurrent] = useState(1);
    const [pagePages,setPagePages] = useState(10);
    const [pageParts,setPageParts] = useState(10);

    const [reload,setReload] = useState(false);

    useEffect(() => {
        CONTEXT.setBread([{ label: 'Logs' } ]);
        CONTEXT.setActions([
            {
                type: 'search',
                label: 'Search',
                action: searchAction
            },
        ]);

        if (paramObjs!=='' && paramObjs!='_' && paramObjs!=undefined){
            const paramObjSplited = paramObjs.split(",");
            setObjs(paramObjSplited);
            setObjsSelected(paramObjSplited);
            setObjs(paramObjSplited);
        }
        if (paramDates!=='' && paramDates!='_' && paramDates!=undefined){
            const paramDatesSplited = paramDates.split(",");
            if (paramDatesSplited[1]!==undefined){
                setDates([
                    stringToDate(paramDatesSplited[0]),
                    stringToDate(paramDatesSplited[1])
                ]);
            }
        } else {
            setDates([
                rangeDateDefault[0],
                rangeDateDefault[1]
            ]);
        }
        setReload(true);
    },[]);

    useEffect(() => {
        if (reload) {
            readData();
        }
    },[reload]);

    const readData = () => {
        const dataSend = {
            pagCurrent,
            search,
            objs,
            date_start: (dateStart!==null && dateStart!==undefined) ? toIsoDate(dateStart) : '',
            date_end: (dateEnd!==null && dateEnd!==undefined) ? toIsoDate(dateEnd) : '',
        }
        CONTEXT.setLoading(true);
        api('getLogsList',CONTEXT.userToken,dataSend,r => {
            CONTEXT.setLoading(false);
            setReload(false);
            if (r.result){
                setLogs(r.data.logs);
                setObjsAll(r.data.objs);
                if (r.data.logs_count!==null){
                    setPagePages(r.data.logs_count);
                }
                if (r.data.parts!==null){
                    setPageParts(r.data.parts);
                }
            }
        });
    }
    
    const searchAction = value => {
        setPagCurrent(1);
        setSearch(value);
    }

    const applyFilter = () => {
        setObjs(objsSelected);
        setDateStart(dates[0]);
        setDateEnd(dates[1]);

        let objsTypes = objsSelected.join(',');
        let objs = objsTypes!='' ? objsTypes : '_';
        let datesParam = '';
        if (dates[0]!==null && dates[0]!==undefined){
            datesParam = datesParam + toIsoDate(dates[0]);
        }
        if (dates[1]!==null && dates[1]!==undefined){
            datesParam = datesParam + ',' + toIsoDate(dates[1]);
        }

        setReload(true);

        history.push(prefixUrl+"logs/"+objs+"/"+datesParam);
    }

    return (
        <LogsStyle>
            <div className="filters">
                <CheckPicker 
                    data={Object.entries(objsAll).map(obj => {
                        return { value: obj[0], label: obj[1] }
                    })} 
                    onSelect={data => setObjsSelected(data)}
                    onClean={() => setObjsSelected([])}
                    placeholder="Please select a category"
                    searchable={false}
                    value={objsSelected}
                />
                <DateRangePicker
                    appearance="default"
                    placeholder="Select Range Date"
                    value={dates}
                    onChange={date => setDates(date)}
                />
                <Button appearance="primary" onClick={() => applyFilter()}>Filtr</Button>
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
                data={logs}
                fields={['ID,id','User name,user_name','Category,object_operation','Type,type_operation','Value,value|log','Date,created_at']}
            />
        </LogsStyle>
    );
}
export default Logs;