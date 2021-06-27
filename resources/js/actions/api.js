import React from 'react';
import axios from 'axios';

export const url = '/api/auth/';
export const urlPhotos = '/uploads/photos/';
export const urlImages = '/assets/images/';
export const baseUrl = '/panel';
export const prefixUrl = baseUrl+'/';
export const pathLogout = baseUrl+'/logout';

const api = (path,token,data,callBack) => {

    const headers={ 
        'Content-Type': 'application/json',
        // 'Accept': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
    };
    if (token!='' && token!==null){
        headers.Authorization = 'Bearer '+token;
    }

    axios.post(url+path,data, { headers , timeout: 12000 })
      .then(res => {
        callBack({ 
          result: true, 
          data: (res.data!=undefined ? res.data : null),
          commTime: (res.commTime!=undefined ? res.commTime : null),
          comm: (res.data.comm!==undefined ? res.data.comm : ''),
        });
      })
      .catch(error => {
        if (error.response==null){
            return false;
          }
          if (error.toString().indexOf('Error: timeout of')>=0){
            callBack({
                result: false, 
                data: null, 
                comm: 'Koniec czasu na wykonanie zapytania', 
                errors: [], 
                errCode: 99,
                comm: (res.data.comm!==undefined ? res.data.comm : ''),
            });
          } else {
            callBack({ 
                result: false, 
                data: null, 
                comm: error.response.data!==undefined ? error.response.data.comm : '', 
                errors: error.response.data!==undefined ? error.response.data.errors : [], 
                errCode: (error.response.data.errCode!==undefined ? error.response.data.errCode : 1),
                commTime: (error.commTime!=undefined ? error.commTime : null),
              });
          }
        
    });
}

export const API_FILE = (path, photo, token, f) => {

  let body = new FormData();
  body.append('photo', photo);
  body.append('Content-Type', photo.type);
  body.append('MimeType', photo.type);

  const options = {
    headers: {
      "Content-Type": "multipart/form-data",
      "cache-control": "no-cache",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "Authorization" : 'Bearer ' + token,
    }
  };

  axios.post(url+path, body,options)
    .then(function (response) {
      f({ result: true, data: response.data });
    })
    .catch(function (error) {
      let Message = '';
      if (error.response.data.message!==undefined){
        Message = error.response.data.message;
      } else {
        Message = error.response.data!==undefined ? error.response.data.comm : '';
      }

      f({ 
        result: false, 
        comm: Message,
        commTime: ((error.response.data!=undefined && error.response.data.commTime!=undefined) ? error.response.data.commTime : null),
      });
    });

}

export default api;