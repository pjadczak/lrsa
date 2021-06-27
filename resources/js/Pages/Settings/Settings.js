import React , { useState, useEffect, useContext } from 'react';
import SettingsStyle from './SettingsStyle';
import api , { baseUrl } from '../../actions/api';
import { StateContext } from '../Front/Front';
import { Row, Col, Toggle , Slider, RangeSlider } from 'rsuite';
import { secondsToTime , alert } from '../../actions/Functions';
import { useHistory } from 'react-router-dom';
import LoadingBlock from '../../components/LoadingBlock/LoadingBlock';

const Component = () => {

    const CONTEXT = useContext(StateContext);
    const history = useHistory();
    const [idle,setIdle] = useState(Boolean(Number(CONTEXT.settings.idle)));
    const [idleTime,setIdleTime] = useState(Number(CONTEXT.settings.idle_time));
    const [ready,setReady] = useState(false);

    useEffect(() => {
        if (CONTEXT.userData.role!=='root'){
            history.push(baseUrl);
        }
        CONTEXT.setLoading(true);
        api('readSettings',CONTEXT.userToken,{},r => {
            CONTEXT.setLoading(false);
            if (r.result){
                setIdle(Boolean(r.data.idle));
                setIdleTime(Number(r.data.idle_time));
                setReady(true);
            }
        });
    },[]);

    useEffect(() => {
        CONTEXT.setBread([{ label: 'Settings' } ]);
        CONTEXT.setActions([
            {
                type: 'change',
                label: 'Save settings',
                action: saveAction
            },
        ]);
    },[idle,idleTime]);

    const saveAction = () => {
        const dataSave = {
            idle: Number(idle),
            idleTime
        }
        CONTEXT.setLoading(true);
        api('saveSettings',CONTEXT.userToken,dataSave,r => {
            CONTEXT.setLoading(false);
            if (r.result){
                alert(r.comm,'success',5000);
            } else {
                alert(r.comm,'error');
            }
        });
    }

    if (!ready) return <LoadingBlock />

    return (
        <SettingsStyle>
            <Row>
                <Col md={24}>
                    <Row>
                        <Col md={8}>
                            <label>Detect idleness</label>
                            <Toggle checked={idle} onChange={v => setIdle(v)} />
                        </Col>
                        <Col md={16}>
                            <label>Idleness time [seconds] - <span>{secondsToTime(idleTime)} minutes</span></label>
                            <Slider
                                value={idleTime}
                                step={120}
                                graduated
                                progress
                                min={120}
                                max={1800}
                                onChange={v => setIdleTime(v)}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </SettingsStyle>
    );
}
export default Component;