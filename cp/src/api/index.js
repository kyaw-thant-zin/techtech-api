import axios from 'axios'

const apiURL = '/api'
const baseURL = 'http://localhost/techtech-api/v1'

const headers = {
    'Content-Type': 'application/json',
}

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
const instance = axios.create({
    baseURL: baseURL,
})

export const API = {
    "auth": {
        "check": async() => {
            try {
                const response = await instance.get(apiURL+'/check-auth')
                return response.data
            } catch (error) {
                return error.response
            }
        },
        "signin": async (formData) => {
            try {
                const response = await instance.get('/sanctum/csrf-cookie')
                if(response.status == 204) {
                    const response = await instance.post(apiURL+'/sign-in', formData, {headers: headers})
                    return response
                }
            } catch (error) {
                return error.response
            }
        },
        "signout": async () => {
            try {
                const response = await instance.post(apiURL+'/sign-out', {headers: headers})
                return response
            } catch (error) {
                return error.response
            }
        }
    },
    "area": {
        "get": (id) => {

        },
        "getAll": async () => {
            const response = await instance.get(apiURL+'/areas', { headers: headers })
            return response.data
        },
        "store": async (formData) => {
            const response = await instance.post(apiURL+'/areas/store', formData, {headers: headers})
            return response.data
        },
        "update": async (id, formData) => {
            const response = await instance.put(apiURL+'/areas/'+id+'/update', formData, {headers: headers})
            return response.data
        },
        "destroy": async (id) => {
            const response = await instance.delete(apiURL+'/areas/'+id+'/destroy', {headers: headers})
            return response.data
        }
    },
    "construction": {
        "get": (id) => {

        },
        "getAll": async () => {
            const response = await instance.get(apiURL+'/constructions', { headers: headers })
            return response.data
        },
        "store": async (formData) => {
            const response = await instance.post(apiURL+'/constructions/store', formData, {headers: headers})
            return response.data
        },
        "update": async (id, formData) => {
            const response = await instance.put(apiURL+'/constructions/'+id+'/update', formData, {headers: headers})
            return response.data
        },
        "destroy": async (id) => {
            const response = await instance.delete(apiURL+'/constructions/'+id+'/destroy', {headers: headers})
            return response.data
        }
    }
}