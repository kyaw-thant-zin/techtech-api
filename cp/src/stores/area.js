import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'

export const useAreaStore = defineStore('area', () => {


    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _areas = ref(null)
    const _area = ref(null)

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error
    }

    const storeSuccess = (success) => {
        _success.value = success
    }

    const storeAreas = (areas) => {
        const filteredAreas = []
        if(areas.length > 0) {
            areas.forEach((area) => {
                const dumpArea = {}
                dumpArea.id = area.id
                dumpArea.code = area.code
                dumpArea.name = area.name
                dumpArea.action = ''
                filteredAreas.push(dumpArea)
            })
        }
        _areas.value = filteredAreas
    }

    const storeArea = (area) => {
        _area.value = area
    }

    const handleAreas = async () => {
        storeLoading(true)
        const response = await API.area.getAll()
        storeAreas(response)
        storeLoading(false)
    }

    const handleArea = (id) => {

    }

    const handleStoreArea = (formData) => {

    }

    return {
        _areas,
        handleAreas,
        handleArea,
        handleStoreArea,
    }

})

