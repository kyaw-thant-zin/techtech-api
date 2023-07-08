import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const usePMStore = defineStore('pm', () => {

    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _pms = ref(null)
    const _pmTablePage = ref(useLocalStorage('pm_table_page', 1))

    const storeTablePagiPage = (pNumber) => {
        _pmTablePage.value = pNumber
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

    const storePM = (pms) => {
        const filteredPM = []
        if(pms.length > 0) {
            pms.forEach((pm) => {
                const dumpPM = {}
                dumpPM.id = pm.id
                dumpPM.code = pm.code
                dumpPM.name = pm.name
                dumpPM.action = ''
                filteredPM.push(dumpPM)
            })
        }
        _pms.value = filteredPM
    }

    const handlePMs = async () => {
        storeLoading(true)
        const response = await API.pm.getAll()
        storePM(response)
        storeLoading(false)
    }

    const handleStorePM = async (formData) => {
        storeLoading(true)
        const response = await API.pm.store(formData)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    const handelUpdatePM = async (id, formData) => {
        storeLoading(true)
        const response = await API.pm.update(id, formData)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    const handleDestroyPM = async (id) => {
        storeLoading(true)
        const response = await API.pm.destroy(id)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    return {
        _pms,
        _success,
        _error,
        _loading,
        _pmTablePage,
        storeError,
        storeSuccess,
        handlePMs,
        handleStorePM,
        handelUpdatePM,
        handleDestroyPM,
        storeTablePagiPage
    }

})

