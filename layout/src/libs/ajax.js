

const baseURL = process.env.NODE_ENV === 'production' ? "https://wallhaven.cc/api/v1/" : "https://wallhaven.cc/api/v1/";


const ajax = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', baseURL + url);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status === 200 || xhr.status === 304) {
                try {
                    resolve(JSON.parse(xhr.responseText));
                } catch (error) {
                    resolve(xhr.responseText);
                }
            } else {
                reject(new Error(xhr.responseText));
            }
        }
        xhr.send();
    })
}



export default ajax;