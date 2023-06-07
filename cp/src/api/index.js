import axios from 'axios'
import { APP } from '@/config.js'

const apiURL = APP.API.PREFIX
const baseURL = APP.API.ACTIVE_API_URL

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
                    const response = await instance.post(apiURL+'/cp/sign-in', formData, {headers: headers})
                    console.log(response)
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
    "pm": {
        "get": (id) => {

        },
        "getAll": async () => {
            const response = await instance.get(apiURL+'/pm', { headers: headers })
            return response.data
        },
        "store": async (formData) => {
            const response = await instance.post(apiURL+'/pm/store', formData, {headers: headers})
            return response.data
        },
        "update": async (id, formData) => {
            const response = await instance.put(apiURL+'/pm/'+id+'/update', formData, {headers: headers})
            return response.data
        },
        "destroy": async (id) => {
            const response = await instance.delete(apiURL+'/pm/'+id+'/destroy', {headers: headers})
            return response.data
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
    },
    "contractor": {
        "getAll": async () => {
            const response = await instance.get(apiURL+'/contractor', { headers: headers })
            return response.data
        },
        "get": async (id) => {
            const response = await instance.get(apiURL+'/contractor/'+id.value+'/detail', { headers: headers })
            return response.data
        },
        "deactivate": async (id) => {
            const response = await instance.delete(apiURL+'/contractor/'+id+'/deactivate', {headers: headers})
            return response.data
        }
    },
    "contact": {
        'getAll': async () => {
            const response = await instance.get(apiURL+'/contact', {headers: headers})
            return response.data
        },
        'get': async (id) => {
            const response = await instance.get(apiURL+'/contact/'+id.value+'/detail', {headers: headers})
            return response.data
        },
        'updateNew': async (id) => {
            const response = await instance.put(apiURL+'/contact/'+id.value+'/update-new', {headers: headers})
            return response.data
        },
        'destroy': async (id) => {
            const response = await instance.delete(apiURL+'/contact/'+id+'/destroy', {headers: headers})
            return response.data
        },
    },
    "questionnaire": {
        'getAll': async () => {
            const response = await instance.get(apiURL+'/questionnaire', {headers: headers})
            return response.data
        },
        'get': async (id) => {
            const response = await instance.get(apiURL+'/questionnaire/'+id.value+'/detail', {headers: headers})
            return response.data
        },
        'store': async (formData) => {
            headers['Content-Type'] = 'multipart/form-data'
            const response = await instance.post(apiURL+'/questionnaire/store', formData, {headers: headers})
            return response.data
        },
        'update': async (id, formData) => {
            headers['Content-Type'] = 'multipart/form-data'
            const response = await instance.post(apiURL+'/questionnaire/'+id.value+'/update', formData, {headers: headers})
            return response.data
        },
        'destroy': async (id) => {
            const response = await instance.delete(apiURL+'/questionnaire/'+id+'/destroy', {headers: headers})
            return response.data
        },
    },
    "setting": {
        'getAll': async () => {
            const response = await instance.get(apiURL+'/settings', {headers: headers})
            return response.data
        },
        'update': async (id, formData) => {
            headers['Content-Type'] = 'multipart/form-data'
            const response = await instance.post(apiURL+'/settings/'+id+'/update', formData, {headers: headers})
            return response.data
        },
    },
    'dashboard': {
        'getAll': async () => {
            const response = await instance.get(apiURL+'/dashboard', {headers: headers})
            return response.data
        },
    }
}