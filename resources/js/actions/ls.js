/*
 * Prosty system do zapisu danych lokalnych w przeglądarce
 * System zapisuje tylko w formacie JSON
 */

const localStorage = window.localStorage;

const  ls = {
    get: (name) => JSON.parse(localStorage.getItem(name)),
    add: (name,data) => localStorage.setItem(name,JSON.stringify(data)),
    clear: (name) => localStorage.removeItem(name),
    clearAll: () => {
        localStorage.clear();
        window.localStorage.clear();
    },
}

export default ls;