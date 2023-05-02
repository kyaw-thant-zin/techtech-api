import axios from 'axios'

const apiURL = '/api'
const baseURL = 'http://localhost/techtech-api/v1'

const headers = {
    'Content-Type': 'application/json',
}

const instance = axios.create({
    baseURL: baseURL,
});

export const API = {
    "area": {
        "get": (id) => {

        },
        "getAll": async () => {
            const response = await instance.get(apiURL+'/areas', { headers: headers })
            return response.data
        },
        "store": (formData) => {

        }
    }
}