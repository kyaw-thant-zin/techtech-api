import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useContractorStore = defineStore('contractor', () => {

    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _contractors = ref(null)
    const _contractor = ref(null)
    const _contractorTablePage = ref(useLocalStorage('contractor_table_page', 1))

    const storeTablePagiPage = (pNumber) => {
        _contractorTablePage.value = pNumber
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

    const storeContractors = (contractors) => {
        const filteredContractors = []
        if(contractors.length > 0) {
            contractors.forEach((con) => {
                const dumpContractor = {}
                dumpContractor.id = con.id
                dumpContractor.status = con.status
                dumpContractor.name = con.name
                dumpContractor.email = con.email
                dumpContractor.company = con.company_name
                dumpContractor.area = con.areas[0].name
                const dumpConstruction = []
                con.constructions.forEach((construct) => {
                    dumpConstruction.push(construct.name)
                })
                dumpContractor.work = dumpConstruction.toString()

                dumpContractor.action = ''
                filteredContractors.push(dumpContractor)
            })
        }
        _contractors.value = filteredContractors
    }

    const storeContractor = (contractor) => {
        _contractor.value = contractor
    }

    const handleContractors = async () => {
        storeLoading(true)
        const response = await API.contractor.getAll()
        storeContractors(response)
        storeLoading(false)
    }

    const handleContractor = async (id) => {
        storeLoading(true)
        const response = await API.contractor.get(id)
        storeContractor(response)
        storeLoading(false)
    }

    const handleDeactivateContractor = async (id) => {
        storeLoading(true)
        const response = await API.contractor.deactivate(id)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    return {
        _contractor,
        _contractors,
        _success,
        _error,
        _loading,
        _contractorTablePage,
        storeError,
        storeSuccess,
        handleContractors,
        handleContractor,
        handleDeactivateContractor,
        storeTablePagiPage
    }

})

