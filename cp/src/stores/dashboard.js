import { ref } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import { API } from '@/api/index.js'

export const useDashboardStore = defineStore('dashboard', () => {

    dayjs.extend(relativeTime)
    dayjs.extend(duration)
    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _contractors = ref(null)
    const _mails = ref(null)
    const _contractorCount = ref(0)
    const _mailCount = ref(0)
    const _inquiryCount = ref(0)
    const _inquiries = ref(null)

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error
    }

    const storeSuccess = (success) => {
        _success.value = success
    }

    const formatCurrency = (value) => {
        const number = Number(value)
        return number.toLocaleString()
    }

    const storeInquiries = (inquiries) => {
        console.log(inquiries)
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
                    dumpIq.schedule = iq.construction_schedule
                    dumpIq.total = formatCurrency(iq.total)+'円(税込)'
                    dumpIq.date = iq.updated_at

                    filteredIq.push(dumpIq)
                }
            })
        }
        console.log(filteredIq)
        _inquiries.value = filteredIq
    }

    const storeDashboard = (dashboard) => {
        _contractors.value = dashboard.contractors
        _mails.value = dashboard.mails
        _contractorCount.value = dashboard.contractors.length
        _mailCount.value = dashboard.mails.length
        _inquiryCount.value = dashboard.inquiryCount
        storeInquiries(dashboard.inquiries)
    }

    const handleGetDashboard = async () => {
        storeLoading(true)
        const response = await API.dashboard.getAll()
        storeDashboard(response)
        storeLoading(false)
    }

    return {
        _contractors,
        _mails,
        _contractorCount,
        _mailCount,
        _success,
        _error,
        _loading,
        _inquiries,
        _inquiryCount,
        storeError,
        storeSuccess,
        handleGetDashboard
    }

})

