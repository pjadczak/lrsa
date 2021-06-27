import localStorage from '../actions/ls';
import { prefixUrl } from '../actions/api';

const Store = (state,action) => {

    switch (action.type){

        /*
         * Save logged user profile data
         **/
        case "SET_USER_DATA": 

            localStorage.clear('userData');
            localStorage.add('userData', action.data);
            return {...state, userData: action.data };

        /*
         * Save logged user Data and token
         **/
        case "SET_USER_FULL_DATA": 

            localStorage.clear('userData');
            localStorage.clear('userToken');
            localStorage.add('userData', action.userData);
            localStorage.add('userToken', action.userToken);
            return {...state, userData: action.userData, userToken: action.userToken, isLogged: true };

        /*
         * Save base user Data
         **/
        case "SAVE_BASE_DATA":

            return {...state,
                    userData: action.data.userData,
                    forms: action.data.forms,
                    lastLogs: action.data.lastLogs,
                    settings: action.data.settings,
            };
            
        /*
         * Logout User
         **/
        case "LOGOUT":
            localStorage.clear('userData');
            localStorage.clear('userToken');
            return { ...state,
                userData: null, 
                userToken: '', 
                isLogged: false, 
                reloadLocalStorage: state.reloadLocalStorage + 1 
            }

        /*
         * Set Iddle 
         **/
        case "IDDLE_LOGOUT":
            localStorage.clear('userToken');
            return {...state,
                idleToken: action.idleToken,
                showIddleLogin: true
            }

        /*
         * Set Show/Hide idle dialog modal
         **/
        case "IDLE_SHOW":
            return {...state, showIddleLogin: action.data }

        /*
         * Set On/Off idle
         **/
        case "IDLE":
            return {...state, idle: action.data }
        
        case "LOADIN_LOGIN":
            return {...state, loadingLogin: action.data }
        
        case "RELOAD_LOCAL_STORAGE":
            return {...state, reloadLocalStorage: state.reloadLocalStorage + 1 }
        
        case "SET_BREAD":
            return {...state, bread: action.data }

        case "SET_ACTIONS":
            return {...state, actions: action.data }
        case "PATH":
            return {...state, path: action.data }
            
        default:
            return state;
    }
    
}
export default Store;