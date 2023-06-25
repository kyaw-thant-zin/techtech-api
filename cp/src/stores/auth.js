import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import Cookies from 'js-cookie'

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

    const storeIsAuth = (isAuth) => {
        _isAuth.value = isAuth
    }

    const storeUser = (user) => {
        _user.value = user
    }

    const handleSignIn = async (formData) => {

        storeLoading(true)
        const response = await API.auth.signin(formData)
        if(response?.error != undefined) {
            // fail
            storeError(true)
            storeIsAuth(false)
        } else {
            // success
            storeSuccess(true)
            storeUser(response.user)
            storeIsAuth(true)
            // set token cookie
            Cookies.set('auth_tkn', response.token, { sameSite: 'strict' })
        }
        storeLoading(false)

    }

    const handleSignOut = async (id) => {
        const response = await API.auth.signout(id)
        if(!response.data) {
            Cookies.remove('auth_tkn', { sameSite: 'strict' })
            storeIsAuth(false)
        } 
        return response.data
    }

    return {
        _isAuth,
        _user,
        _loading,
        _success,
        _error,
        storeSuccess,
        storeError,
        handleSignIn,
        handleSignOut,
        storeUser
    }

})