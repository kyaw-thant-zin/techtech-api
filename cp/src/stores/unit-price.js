import { ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useUnitPriceStore = defineStore('unitprice', () => {


    dayjs.extend(relativeTime)
    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _unitPrices = ref([])
    const _unitPrice = ref(null)
    const _unitPriceDetails = ref([])
    const _unitpriceTablePage = ref(useLocalStorage('unitprice_table_page', 1))

    const storeTablePagiPage = (pNumber) => {
        _unitpriceTablePage.value = pNumber
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

    const storeUnitPrices = (unitPrices, type, id) => {
        console.log(id)
        const filtered = []
        const unitPD = []
        if(type == 'index') {
            if(unitPrices.length > 0) {
                unitPrices.forEach((up) => {
                    const dumpF = {}
                    dumpF.id = up.id
                    dumpF.name = up.name
                    dumpF.action = ''
                    filtered.push(dumpF)
                })
            }
        } else if(type == 'detail') {
            if(unitPrices.length > 0) {
                unitPrices.forEach((up) => {
                    const dumpF = {}
                    dumpF.label = up.name
                    dumpF.value = up.id
                    filtered.push(dumpF)

                    if(id == up.id) {
                        _unitPrice.value = dumpF

                        if(up.unit_price_details != null && up.unit_price_details.length > 0) {
                            up.unit_price_details.forEach((upd) => {
                                const dumpUPD = {}
                                dumpUPD.id = upd.id
                                dumpUPD.large_classification = upd.large_classification
                                dumpUPD.minor_classification = upd.minor_classification
                                dumpUPD.content = upd.content
                                dumpUPD.specification = upd.specification
                                dumpUPD.prefecture = upd?.area?.name+'県'
                                dumpUPD.amount = upd.amount
                                dumpUPD.action = ''
                                unitPD.push(dumpUPD)
                            })
                        }
                    }
                })
                
            }
        }

        _unitPriceDetails.value = unitPD
        _unitPrices.value = filtered
    }

    const handleGetUnitPrices = async (type, id) => {
        storeLoading(true)
        const response = await API.unitPrice.getAll()
        storeUnitPrices(response, type, id)
        storeLoading(false)
    }

    const handleStoreUnitPrice = async (formData) => {
        storeLoading(true)
        const response = await API.unitPrice.store(formData)
        if(response) {
            storeSuccess(true)
            storeError(false)
        } else {
            storeError(true)
            storeSuccess(false)
        }
        storeLoading(false)
    }

    const handleDestroyUnitPriceDetail = async (id) => {
        storeLoading(true)
        const response = await API.unitPrice.destroy(id)
        if(response) {
            storeSuccess(true)
            storeError(false)
        } else {
            storeError(true)
            storeSuccess(false)
        }
        storeLoading(false)
    }

    const reset = () => {
        _error.value = false
        _loading.value = false
        _success.value = false
        _unitpriceTablePage.value = 1
    }

    return {
        _success,
        _error,
        _loading,
        _unitpriceTablePage,
        _unitPriceDetails,
        _unitPrices,
        _unitPrice,
        reset,
        storeError,
        storeSuccess,
        storeTablePagiPage,
        handleGetUnitPrices,
        handleStoreUnitPrice,
        handleDestroyUnitPriceDetail
    }

})