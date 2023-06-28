import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

export const useInquiryStore = defineStore('inquiry', () => {

    dayjs.extend(relativeTime)
    dayjs.extend(duration)
    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _inquiries = ref(null)

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

    const handleGetInquiries = async () => {
        storeLoading(true)
        const response = await API.inquiry.getAll()
        storeInquiries(response)
        storeLoading(false)
    }

    return {
        _inquiries,
        _success,
        _error,
        _loading,
        storeError,
        storeSuccess,
        handleGetInquiries
    }

})

