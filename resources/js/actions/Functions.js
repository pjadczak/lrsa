import React from 'react';
import { Notification , Alert } from 'rsuite';
import { formatDate } from './timeAgo';

export const alert = (text,type="info", duration = 5000) => {
    if (duration==null) duration=2000;
    if (type=='success') Alert.success(text, duration )
    else if (type=='error') Alert.error(text, duration )
    else if (type=='warning') Alert.error(text, duration )
    else Alert.info(text, duration )
}

export const sn = ( title, description , type="info" , duration = 4500) => {

    Notification[type]({
        title,
        description,
        duration,
        key: title+description,
    });
}

export const correctSlug = text => {
    let Text = text.toLowerCase();
        Text = Text.replace(/[^a-zA-Z0-9]+/g,'-');
    return  Text;
}


export const localeCalendar = {
    sunday: 'Su',
    monday: 'Mo',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Th',
    friday: 'Pi',
    saturday: 'Sat',
    ok: 'OK',
    today: 'Today',
    yesterday: 'Yesterday',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds'
};

export const toIsoDate = (date,returnDate=true) => {
    var isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return returnDate ? isoDateTime.substr(0,10) : isoDateTime.substr(11,5);
}

export const rand = (length=10) => {
    let s = '';
    do { s += Math.random().toString(36).substr(2); } while (s.length < length);
    s = s.substr(0, length);
    
    return s;
}

export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const onNull = text => {
    if (text===null) return '';
    return text;
}

export const generateRandomString = (length=10,extend = true) => {
    const pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" + (extend ? ';/?<>,.@#$%^&*!' : '');
    return Array(length).fill(pwdChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
}

export const stringToDate = (dateStr) => {
    if (dateStr=='' || dateStr==undefined || dateStr==null) return '';
    const year = dateStr.toString().substr(0,4);
    const month = dateStr.toString().substr(5,2);
    const day = dateStr.toString().substr(8,2);
  
    const hour = dateStr.toString().substr(11,2);
    const minute = dateStr.toString().substr(14,2);
    const second = dateStr.toString().substr(17,2);
  
    return new Date(year,parseInt(month-1),day,hour,minute,second);
  }

  export const stringToTime = dateStr => {
    const year = dateStr.toString().substr(0,4);
    const month = dateStr.toString().substr(5,2);
    const day = dateStr.toString().substr(8,2);
  
    const hour = dateStr.toString().substr(11,2);
    const minute = dateStr.toString().substr(14,2);
    const second = dateStr.toString().substr(17,2);
  
    return new Date(year,parseInt(month-1),day,hour,minute,second).getTime();
  }

export function isEmpty(obj) {
    if (obj===null || obj===undefined || obj==="" || obj==="null") return true;
    return Object.keys(obj).length === 0;
}

export const secondsToTime = (secs) => {
    var sec_num = parseInt(secs, 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}

export const DateStringConvert = date => {
    return date.substring(0,10)+' '+date.substr(11,5);
}