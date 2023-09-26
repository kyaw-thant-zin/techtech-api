import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'

export const useMaintenanceStore = defineStore('maintenance', () => {

    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _maintenance = ref(null)

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error
    }

    const storeSuccess = (success) => {
        _success.value = success
    }

    const storeMaintenance = (maintenance) => {
        const dumpMaintenance = maintenance?.maintenance
        _maintenance.value = dumpMaintenance
        return dumpMaintenance
    }

    const handleMaintenance = async (id) => {
        storeLoading(true)
        const response = await API.maintenance.get(id)
        storeLoading(false)
        return storeMaintenance(response)
    }

    const handelUpdateMaintenance = async (id, formData) => {
        storeLoading(true)
        const response = await API.maintenance.update(id, formData)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    return {
        _success,
        _error,
        _loading,
        storeLoading,
        _maintenance,
        storeError,
        storeSuccess,
        handleMaintenance,
        handelUpdateMaintenance
    }

})

