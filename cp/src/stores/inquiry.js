import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import { useLocalStorage } from '@vueuse/core'

export const useInquiryStore = defineStore('inquiry', () => {

    dayjs.extend(relativeTime)
    dayjs.extend(duration)
    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _inquiries = ref(null)
    const _inquiriy = ref(null)
    const _inquiryTablePage = ref(useLocalStorage('inquiry_table_page', 1))

    const storeTablePagiPage = (pNumber) => {
        _inquiryTablePage.value = pNumber
    }

    const formatCurrency = (value) => {
        const number = Number(value)
        return number.toLocaleString()
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

    const storeInquiries = (inquiries) => {
        // console.log(inquiries)
        const filteredIq = []
        if(inquiries.length > 0) {
            inquiries.forEach((iq) => {
                if(iq.confirm == 1) {
                    const dumpIq = {}
                    dumpIq.id = iq.id
                    if(iq.user_id != null) {
                        // confirmed by contractor
                        dumpIq.status = 2
                    }
                    if(iq.user_id == null && dayjs().isAfter(iq.construction_schedule, 'date')) {
                        // construction date passed
                        dumpIq.status = 3
                    }

                    const milli = dayjs(iq.construction_schedule).diff(dayjs())
                    const durationObj = dayjs.duration(milli).$d
                    if(iq.user_id == null && durationObj.days < 10) {
                        // construction date so close
                        dumpIq.status = 1
                    }
                    
                    dumpIq.status = 0
                    dumpIq.name = iq.name
                    dumpIq.email = iq.email
                    dumpIq.summry = iq?.inquiry_quotes?.length
                    dumpIq.total = formatCurrency(iq.total)+'円(税込)'
                    dumpIq.action = ''

                    filteredIq.push(dumpIq)
                }
                
            })
        }
        _inquiries.value = filteredIq
    }

    const storeInquirie = (iq) => {
        let dumpIq = null
        if(iq != null) {
            dumpIq = {}
            console.log(iq)
            dumpIq.name = iq.name
            dumpIq.kata_name = iq.kata_name
            dumpIq.email = iq.email
            dumpIq.tel = iq.tel
            dumpIq.company_name = iq.company_name
            dumpIq.area = iq.area
            dumpIq.city = iq.city
            dumpIq.address02 = iq.address02
            dumpIq.construction_schedule = iq.construction_schedule

            dumpIq.total = formatCurrency(iq.total)+'円(税込)'
            const iQQuotes = iq.inquiry_quotes
            dumpIq.quotes = []
            if(iQQuotes != null && iQQuotes.length > 0) {
                iQQuotes.forEach((dIq) => {
                    const dumpDiq = {}
                    dumpDiq.q_name = dIq.quotation.q_name
                    dumpDiq.quantity = dIq.quantity
                    dumpDiq.unit_price = dIq.unit_price
                    dumpDiq.amount = dIq.amount
                    dumpIq.quotes.push(dumpDiq)
                })
            }
            dumpIq.qa_ans = []
            if(iq?.inquiry_qa_ans.length > 0) {
                iq.inquiry_qa_ans.forEach((iqa) => {
                    const dumpIqa = {}
                    dumpIqa.q = iqa.q_only.q
                    if(iqa?.qa != null) {
                        dumpIqa.ans = iqa.qa.label
                    } else {
                        dumpIqa.ans = iqa.qa_value
                    }
                    dumpIq.qa_ans.push(dumpIqa)
                })
            }
        }
        console.log(dumpIq)
        _inquiriy.value = dumpIq
    }

    const handleGetInquiries = async () => {
        storeLoading(true)
        const response = await API.inquiry.getAll()
        storeInquiries(response)
        storeLoading(false)
    }

    const handleGetInquirie = async (id) => {
        storeLoading(true)
        const response = await API.inquiry.get(id)
        storeInquirie(response)
        storeLoading(false)
    }

    return {
        _inquiries,
        _inquiriy,
        _success,
        _error,
        _loading,
        _inquiryTablePage,
        storeError,
        storeSuccess,
        handleGetInquiries,
        storeTablePagiPage,
        handleGetInquirie
    }

})

