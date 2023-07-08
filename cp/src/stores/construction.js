import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useConstructionStore = defineStore('construction', () => {
    
    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _constructions = ref(null)
    const _constructionTablePage = ref(useLocalStorage('construction_table_page', 1))

    const storeTablePagiPage = (pNumber) => {
        _constructionTablePage.value = pNumber
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

    const storeConstructions = (constructions) => {
        const filteredConstruction = []
        if(constructions.length > 0) {
            constructions.forEach((construction) => {
                const dumpConstruction = {}
                dumpConstruction.id = construction.id
                dumpConstruction.code = construction.code
                dumpConstruction.name = construction.name
                dumpConstruction.action = ''
                filteredConstruction.push(dumpConstruction)
            })
        }
        _constructions.value = filteredConstruction
    }

    const handleConstructions = async () => {
        storeLoading(true)
        const response = await API.construction.getAll()
        storeConstructions(response)
        storeLoading(false)
    }

    const handleStoreConstructions = async (formData) => {
        storeLoading(true)
        const response = await API.construction.store(formData)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    const handelUpdateConstruction = async (id, formData) => {
        storeLoading(true)
        const response = await API.construction.update(id, formData)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    const handleDestroyConstruction = async (id) => {
        storeLoading(true)
        const response = await API.construction.destroy(id)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    return {
        _constructions,
        _success,
        _error,
        _loading,
        _constructionTablePage,
        storeSuccess,
        storeError,
        handleConstructions,
        handleStoreConstructions,
        handelUpdateConstruction,
        handleDestroyConstruction,
        storeTablePagiPage
    }

})