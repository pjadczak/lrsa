import React , { useEffect , useState } from 'react';
import { useParams } from "react-router-dom";
import api from '../../../actions/api';
import { BoxLogin } from '../../../Styles/StartPageStyle';
import { Loader } from 'rsuite';
import { defaultOrganizerActivatePage , defaultPlayerPage , defaultAdminPage } from '../../../actions/Variables';
import localStorage from '../../../actions/ls';

const Activate = () => {

    const { token } = useParams();
    const [loading,setLoading] = useState(true);
    const [resultText,setResulText] = useState('');
    const [result,setResult] = useState(true);

    useEffect(() => {
        localStorage.clear('userData');
        api('activate','',{ token } ,r => {
            setLoading(false);

            if (r.result){
                setResult(true);
                setResulText(r.comm);

                // zapis danych do local storage
                localStorage.add('userData', r.data.userData);
                setTimeout(() => {
                    if (r.data.userData.role=='organizer' || r.data.userData.role=='worker') window.location.href=defaultOrganizerActivatePage;
                    else if (r.data.userData.role=='player') window.location.href=defaultPlayerPage;
                    else if (r.data.userData.role=='admin') window.location.href=defaultAdminPage;
                },5000);

            } else {
                setResult(false);
                setResulText(r.comm);
            }
        });

    },[]);

    return (
        <>
            <BoxLogin>
                <div className="box box-lone">
                    <header>Aktywacja użytkownika</header>
                    <div className={"content"+(result ? ' content-ok' : ' content-error')}>
                        {loading && <Loader size="md" />}
                        {(resultText!='' && !loading) && <p>{resultText}</p>}
                    </div>
                </div>
            </BoxLogin>
        </>
    )
}

export default Activate;