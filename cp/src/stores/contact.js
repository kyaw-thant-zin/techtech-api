import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'

export const useContactStore = defineStore('contact', () => {

    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _contacts = ref(null)
    const _contact = ref(null)

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error
    }

    const storeSuccess = (success) => {
        _success.value = success
    }

    const storeContact = (contact) => {
        _contact.value = contact
    }

    const storeContacts = (contacts) => {
        const filteredContacts = []
        if(contacts.length > 0) {
            contacts.forEach((con) => {
                const dumpContact = {}
                dumpContact.id = con.id
                dumpContact.new = con.new
                dumpContact.direction = 1
                dumpContact.company = con.company_name
                dumpContact.name = con.name
                dumpContact.email = con.email
                dumpContact.tel = con.tel
                dumpContact.action = ''
                filteredContacts.push(dumpContact)
            })
        }
        _contacts.value = filteredContacts
    }

    const handleGetContacts = async () => {
        storeLoading(true)
        const response = await API.contact.getAll()
        storeContacts(response)
        storeLoading(false)
    }

    const handleGetContact = async (id) => {
        storeLoading(true)
        const response = await API.contact.get(id)
        storeContact(response)
        storeLoading(false)
    }

    const handleUpdateContactNew = async (id) => {
        storeLoading(true)
        const response = await API.contact.updateNew(id)
        if(response) {
            storeSuccess(response)
        } else {
            storeError(response)
        }
        storeLoading(false)
    }

    const handleDestroyContact = async (id) => {
        storeLoading(true)
        const response = await API.contact.destroy(id)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    return {
        _contact,
        _contacts,
        _loading,
        _success,
        _error,
        storeSuccess,
        storeError,
        handleGetContacts,
        handleGetContact,
        handleUpdateContactNew,
        handleDestroyContact
    }

})