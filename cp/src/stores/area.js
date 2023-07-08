import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useAreaStore = defineStore('area', () => {

    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _areas = ref(null)
    const _areaTablePage = ref(useLocalStorage('area_table_page', 1))

    const storeTablePagiPage = (pNumber) => {
        _areaTablePage.value = pNumber
    }

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

    const handleAreas = async () => {
        storeLoading(true)
        const response = await API.area.getAll()
        storeAreas(response)
        storeLoading(false)
    }

    const handleArea = (id) => {

    }

    const handleStoreArea = async (formData) => {
        storeLoading(true)
        const response = await API.area.store(formData)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    const handelUpdateArea = async (id, formData) => {
        storeLoading(true)
        const response = await API.area.update(id, formData)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    const handleDestroyArea = async (id) => {
        storeLoading(true)
        const response = await API.area.destroy(id)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    return {
        _areas,
        _success,
        _error,
        _loading,
        _areaTablePage,
        storeError,
        storeSuccess,
        handleAreas,
        handleArea,
        handleStoreArea,
        handelUpdateArea,
        handleDestroyArea,
        storeTablePagiPage
    }

})

