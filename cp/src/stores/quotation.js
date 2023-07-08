import { ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useQuotationStore = defineStore('quotation', () => {


    dayjs.extend(relativeTime)
    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _symbols = ref([])
    const _qqs = ref([])
    const _qas = ref([])
    const _quotationIDs = ref([])
    const _quotations = ref([])
    const _quotation = ref(null)
    const _quotationTablePage = ref(useLocalStorage('quotation_table_page', 1))

    const storeTablePagiPage = (pNumber) => {
        _quotationTablePage.value = pNumber
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

    const storeSymbols = (symbols) => {
        const dumpSymbols = []
        if(symbols.length > 0) {
            symbols.forEach(s => {
                const dumpS = {
                    'label': s.jp_name,
                    'value': s.id
                }
                dumpSymbols.push(dumpS)
            });
        }
        _symbols.value = dumpSymbols
    }

    const storeQqs = (qqs) => {
        const dumpQqs = []
        if(qqs.length > 0) {
            qqs.forEach((q, index) => {
                const dumpQ = {
                    'label': 'Q'+q.qindex,
                    'value': q.id
                }
                dumpQqs.push(dumpQ)
            });
        }
        _qqs.value = dumpQqs
    }

    const storeQas = (qas) => {
        let groupedQas = {}
        if(qas.length > 0) {
            groupedQas = qas.reduce((result, qa) => {
                const { qq_id, label, id } = qa;
                if (!result['q-' + qq_id]) {
                    result['q-' + qq_id] = [];
                }
                result['q-' + qq_id].push({ 'label': label, 'value': id });
                return result;
            }, {});
        }
        _qas.value = groupedQas
    }

    const storeQuotationIDs = (q) => {
        const dumpQs = [{label: 'なし', value: 0}]
        if(q.length > 0) {
            q.forEach((qu, index) => {
                const dumpQ = {
                    'label': qu.q_name,
                    'value': qu.id
                }
                dumpQs.push(dumpQ)
            });
        }
        _quotationIDs.value = dumpQs
    }

    const storeQuotations = (quotations) => {
        const filteredQ = []
        const emDash = '\u2014'
        if(quotations.length > 0) {
            quotations.forEach((q, index) => {
                const dumpQ = {}
                dumpQ.id = q.id
                dumpQ.name = q.parent_id != null ? emDash+q.q_name+' ('+q.parent.q_name+')':q.q_name
                dumpQ.base_amount = q.base_amount != null ? q.base_amount:0
                dumpQ.created = dayjs(q.updated_at).fromNow()
                dumpQ.action = ''
                filteredQ.push(dumpQ)
            })
        }
        _quotations.value  = filteredQ
    }

    const storeQuotation = (quotation) => {
        _quotation.value  = quotation
    }

    const handleGetAllRequired = async () => {
        storeLoading(true)
        const response = await API.quotation.getAllRequiredToCreate()
        if(response?.symbols) {
            storeSymbols(response.symbols)
        }
        if(response?.qqs) {
            storeQqs(response.qqs)
        }
        if(response?.qas) {
            storeQas(response.qas)
        }
        if(response?.quotation) {
            storeQuotationIDs(response.quotation)
        }
        storeLoading(false)
    }

    const handleGetQuotations = async () => {
        storeLoading(true)
        const response = await API.quotation.getAll()
        storeQuotations(response)
        storeLoading(false)
    }

    const handleStoreQuotation  = async (formData) => {
        storeLoading(true)
        const response = await API.quotation.store(formData)
        if(response) { 
            storeSuccess(true)
            storeError(false)
        } else {
            storeError(true)
            storeSuccess(false)
        }
        storeLoading(false)
    }

    const handleGetQuotation = async (id) => {
        storeLoading(true)
        const response = await API.quotation.get(id)
        storeQuotation(response)
        storeLoading(false)
    }

    const handleUpdateQuotation = async (id, formData) => {
        storeLoading(true)
        const response = await API.quotation.update(id, formData)
        if(response) {
            storeSuccess(response)
        } else {
            storeError(response)
        }
        storeLoading(false)
    }

    const handleDestroyQuotation = async (id) => {
        storeLoading(true)
        const response = await API.quotation.destroy(id)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    const reset = () => {
        _symbols.value = []
        _qqs.value = []
        _qas.value = []
        _quotationIDs.value = []
        _quotations.value = []
        _quotation.value = null
    }

    return {
        _success,
        _error,
        _loading,
        _symbols,
        _qqs,
        _qas,
        _quotationIDs,
        _quotations,
        _quotation,
        _quotationTablePage,
        reset,
        storeError,
        storeSuccess,
        handleGetAllRequired,
        handleStoreQuotation,
        handleGetQuotations,
        handleGetQuotation,
        handleUpdateQuotation,
        handleDestroyQuotation,
        storeTablePagiPage
    }

})

