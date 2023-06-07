import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'

export const useDashboardStore = defineStore('dashboard', () => {

    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _contractors = ref(null)
    const _mails = ref(null)
    const _contractorCount = ref(0)
    const _mailCount = ref(0)

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error
    }

    const storeSuccess = (success) => {
        _success.value = success
    }

    const storeDashboard = (dashboard) => {
        _contractors.value = dashboard.contractors
        _mails.value = dashboard.mails
        _contractorCount.value = dashboard.contractors.length
        _mailCount.value = dashboard.mails.length
    }

    const handleGetDashboard = async () => {
        storeLoading(true)
        const response = await API.dashboard.getAll()
        console.log(response)
        storeDashboard(response)
        storeLoading(false)
    }

    return {
        _contractors,
        _mails,
        _contractorCount,
        _mailCount,
        _success,
        _error,
        _loading,
        storeError,
        storeSuccess,
        handleGetDashboard
    }

})

