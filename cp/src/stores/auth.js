import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'

export const useAuthStore = defineStore('auth', () => {

    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _user = ref(null)
    const _isAuth = ref(false)

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error
    }

    const storeSuccess = (success) => {
        _success.value = success
    }

    const storeUser = (user) => {
        _user.value = user
    }

    const handleSignIn = async (formData) => {

        storeLoading(true)
        const response = await API.auth.signin(formData)
        if(response.data?.id != undefined) {
            storeSuccess(true)
            storeUser(response.data)
        } else {
            storeError(true)
        }
        storeLoading(false)

    }

    const handleSignOut = async () => {
        const response = await API.auth.signout()
        return response.data
    }

    return {
        _user,
        _loading,
        _success,
        _error,
        storeSuccess,
        storeError,
        handleSignIn,
        handleSignOut
    }

})