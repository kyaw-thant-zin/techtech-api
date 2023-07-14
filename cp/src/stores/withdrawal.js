import { ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useWithdrawalStore = defineStore('withdrawal', () => {


    dayjs.extend(relativeTime)
    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _withdrawals = ref([])
    const _withdrawal = ref(null)
    const _withdrawalTablePage = ref(useLocalStorage('withdrawal_table_page', 1))

    const storeTablePagiPage = (pNumber) => {
        _withdrawalTablePage.value = pNumber
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

    const storeWithdrawals = (withdrawals) => {
        const filtered = []
        if(Object.keys(withdrawals).length !== 0) {
            for(let key in withdrawals) {
                const w = withdrawals[key]
                filtered.push({
                    'id': w.id,
                    'status': w.status,
                    'requested_date': dayjs(w.created_at).fromNow(),
                    'company': w.company_name,
                    'email': w.email,
                    'workdone': w.inquiry_count,
                    'duplicated_count': w.duplicated_count,
                    'action': ''
                })
            }
        }
        _withdrawals.value = filtered
    }

    const handleGetAllWithDrawals = async () => {
        storeLoading(true)
        const response = await API.withdrawal.getAll()
        storeWithdrawals(response)
        storeLoading(false)
    }

    const storeWithdrawal = (withdrawal) => {
        _withdrawal.value = withdrawal
    }

    const handleGetWithdrawal = async (id) => {
        storeLoading(true)
        const response = await API.withdrawal.detail(id)
        storeWithdrawal(response)
        storeLoading(false)
    }

    const confirm = async (id) => {
        storeLoading(true)
        const response = await API.withdrawal.confirm(id)
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
        _withdrawal,
        _withdrawals,
        _withdrawalTablePage,
        storeError,
        storeSuccess,
        handleGetAllWithDrawals,
        handleGetWithdrawal,
        storeTablePagiPage,
        confirm
    }

})
