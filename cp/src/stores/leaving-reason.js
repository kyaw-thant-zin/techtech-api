import { ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useLeavingReasonStore = defineStore('leaving-reason', () => {


    dayjs.extend(relativeTime)
    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _leavingReasons = ref([])
    const _leavingReasonTablePage = ref(useLocalStorage('leaving_reason_table_page', 1))

    const storeTablePagiPage = (pNumber) => {
        _leavingReasonTablePage.value = pNumber
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

    const storeLeavingReasons = (leavingReasons) => {
        const filteredLRs = []
        if(leavingReasons.length > 0) {
            leavingReasons.forEach((lr) => {
                const dumpLR = {}
                dumpLR.id = lr.id
                dumpLR.code = lr.code
                dumpLR.name = lr.name
                dumpLR.action = ''
                filteredLRs.push(dumpLR)
            })
        }
        _leavingReasons.value = filteredLRs
    }

    const handleGetAllLeavingReason = async () => {
        storeLoading(true)
        const response = await API.leavingReason.getAll()
        storeLeavingReasons(response)
        storeLoading(false)
    }

    const handleStore = async (formData) => {
        storeLoading(true)
        const response = await API.leavingReason.store(formData)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    const handelUpdate = async (id, formData) => {
        storeLoading(true)
        const response = await API.leavingReason.update(id, formData)
        if(response) {
            storeSuccess(true)
            storeError(false)
        } else {
            storeError(true)
            storeSuccess(false)
        }
        storeLoading(false)
    }

    const handleDestroy = async (id) => {
        storeLoading(true)
        const response = await API.leavingReason.destroy(id)
        if(response) {
            storeSuccess(true)
            storeError(false)
        } else {
            storeError(true)
            storeSuccess(false)
        }
        storeLoading(false)
    }

    return {
        _success,
        _error,
        _loading,
        _leavingReasonTablePage,
        _leavingReasons,
        storeError,
        storeSuccess,
        handleGetAllLeavingReason,
        storeTablePagiPage,
        handleStore,
        handelUpdate,
        handleDestroy
    }

})
