const axios = require('axios');
const axiosInstance = axios.create({
    baseURL: 'https://productcomparator-a082.restdb.io/rest/',
    headers: {
        'cache-control': 'no-cache',
        'x-apikey': '65b115cbca07970e6d0079ebf747d26ad5fac',
        'content-type': 'application/json'
    },
    json: true
});

module.exports = {
    axiosInstance: axiosInstance,
    get: axiosInstance.get,
    post: axiosInstance.post,
    put: axiosInstance.put,
    delete: axiosInstance.delete
}