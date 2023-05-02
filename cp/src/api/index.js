import axios from 'axios'

const apiURL = '/api'
const baseURL = 'http://localhost/techtech-api/v1'

const headers = {
    'Content-Type': 'application/json',
}

const instance = axios.create({
    baseURL: baseURL,
})

export const API = {
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