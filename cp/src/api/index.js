import axios from 'axios'
import { APP } from '@/config.js'
import Cookies from 'js-cookie'

const apiURL = APP.API.PREFIX
const baseURL = APP.API.ACTIVE_API_URL

const headers = {
    'Content-Type': 'application/json',
}

axios.defaults.withCredentials = true
const instance = axios.create({
    baseURL: baseURL,
})

instance.interceptors.request.use((config) => {
    const token = Cookies.get('auth_tkn');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    } else {
      delete config.headers['Authorization']
    }
    return config
})

export const API = {
    "auth": {
        "check": async() => {
            try {
                const response = await instance.get(apiURL+'/check-auth',  {headers: headers})
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
                    return response.data
                }
            } catch (error) {
                return error.response
            }
        },
        "signout": async (id) => {
            try {
                const response = await instance.post(apiURL+'/sign-out', {'id': id}, {headers: headers})
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
        'getQAndLastQindex': async () => {
            const response = await instance.get(apiURL+'/questionnaire/get-last-qindex', {headers: headers})
            return response.data
        }
    },
    "quotation": {
        "getAll": async () => {
            const response = await instance.get(apiURL+'/quotation', {headers: headers})
            return response.data
        },
        "get": async (id) => {
            const response = await instance.get(apiURL+'/quotation/'+id+'/detail', {headers: headers})
            return response.data
        },
        "getAllRequiredToCreate": async () => {
            const response = await instance.get(apiURL+'/quotation/create', {headers: headers})
            return response.data
        },
        "store": async (formData) => {
            const response = await instance.post(apiURL+'/quotation/store', formData, {headers: headers})
            return response.data
        },
        "update": async (id, formData) => {
            const response = await instance.post(apiURL+'/quotation/'+id+'/update', formData, {headers: headers})
            return response.data
        },
        'destroy': async (id) => {
            const response = await instance.delete(apiURL+'/quotation/'+id+'/destroy', {headers: headers})
            return response.data
        },
    },
    "inquiry" : {
        "getAll": async () => {
            const response = await instance.get(apiURL+'/inquiry/get-all', {headers: headers})
            return response.data
        },
        "get": async (id) => {
            const response = await instance.get(apiURL+'/inquiry/'+id+'/detail', {headers: headers})
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
        'clearCache': async () => {
            const response = await instance.get(apiURL+'/settings/clear-cache', {headers: headers})
            return response.data
        }
    },
    'dashboard': {
        'getAll': async () => {
            const response = await instance.get(apiURL+'/dashboard', {headers: headers})
            return response.data
        },
    },
    'leavingReason': {
        'getAll': async () => {
            const response = await instance.get(apiURL+'/leaving-reason', {headers: headers})
            return response.data
        },
        "store": async (formData) => {
            const response = await instance.post(apiURL+'/leaving-reason/store', formData, {headers: headers})
            return response.data
        },
        "update": async (id, formData) => {
            const response = await instance.put(apiURL+'/leaving-reason/'+id+'/update', formData, {headers: headers})
            return response.data
        },
        'destroy': async (id) => {
            const response = await instance.delete(apiURL+'/leaving-reason/'+id+'/destroy', {headers: headers})
            return response.data
        },
    },
    'withdrawal': {
        'getAll': async () => {
            const response = await instance.get(apiURL+'/withdrawal', {headers: headers})
            return response.data
        },
        "detail": async (id) => {
            const response = await instance.get(apiURL+'/withdrawal/'+id+'/detail', {headers: headers})
            return response.data
        },
        "confirm": async (id) => {
            const response = await instance.post(apiURL+'/withdrawal/'+id+'/confirm', {headers: headers})
            return response.data
        },
    },
    "maintenance": {
        "get": async () => {
            const response = await instance.get(apiURL+'/maintenance/'+id+'/detail', {headers: headers})
            return response.data
        },
        "update": async (id, formData) => {
            const response = await instance.put(apiURL+'/maintenance/'+id+'/update', formData, {headers: headers})
            return response.data
        },
    }
}