import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'

export const useMailSettingStore = defineStore('mailSettings', () => {

    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _mailSettings = ref(null)

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error
    }

    const storeSuccess = (success) => {
        _success.value = success
    }

    const storeMailSettings = (mailSettings) => {
        _mailSettings.value = mailSettings
        return mailSettings
    }

    const handleMailSettings = async () => {
        storeLoading(true)
        const response = await API.mailSettings.getAll()
        storeLoading(false)
        return storeMailSettings(response)
    }

    const handelUpdateMailSetting = async (id, formData) => {
        storeLoading(true)
        const response = await API.mailSettings.update(id, formData)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    return {
        _mailSettings,
        _success,
        _error,
        _loading,
        storeError,
        storeSuccess,
        handleMailSettings,
        handelUpdateMailSetting,
    }

})

