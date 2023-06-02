import { ref } from 'vue'
import { defineStore } from 'pinia'
import { APP } from '@/config.js'
import { API } from '@/api/index.js'

export const useQuestionnaireStore = defineStore('questionnaire', () => {

    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _questionnaires = ref(null)
    const _questionnaire = ref(null)

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error
    }

    const storeSuccess = (success) => {
        _success.value = success
    }

    const storeQuestionnaire = (questionnaire) => {
        const q = {
            'formData': {
                'question': '',
                'prefix': '',
                'inputType': ''
            },
            'textItems': {
                'textType': '',
                'label': '',
                'measure': '',
                'amount': ''
            },
            'selectItems': [],
            'choiceItems': []
        }
        if(questionnaire != null) {
            // set formData
            q.formData.question = questionnaire.q
            q.formData.prefix = questionnaire.prefix
            q.formData.inputType = questionnaire.q_ans_input_type.type

            const qInputType = questionnaire.q_ans_input_type.type
            const qAll = questionnaire.qas_with_all
            if(qAll != null) {
                qAll.forEach(qT => {
                    if(qInputType == 'テキスト') {
                        // input text
                        if(qT.measure_id != null) {
                            q.textItems.textType = '対策'
                            if(qT.measure != null) {
                                q.textItems.measure = qT.measure.type
                                q.textItems.amount = qT.amount
                            }
                        } else {
                            q.textItems.textType = '自由入力'
                            q.textItems.label = qT.suffix
                        }
                    } else if(qInputType == '選択') {
                        // input select
                        const dumpSelectItem = {
                            'label': qT.label,
                            'amount': qT.amount,
                        }
                        q.selectItems.push(dumpSelectItem)
                    } else if(qInputType == '選択肢') {
                        // input choice
                        const dumpChoiceItem = {
                            label: qT.label,
                            imagePath: qT.image != null ? APP.API.LOCAL_URL+APP.API.PREFIX+'/'+qT.image:null,
                            amount: qT.amount
                        }
                        q.choiceItems.push(dumpChoiceItem)
                    }
                });
            }
        }
        _questionnaire.value = q
    }

    const storeQuestionnaires = (questionnaires) => {
        const filteredQuests = []
        if(questionnaires.length > 0) {
            questionnaires.forEach((q) => {
                const dumpQuest = {}
                dumpQuest.id = q.id
                dumpQuest.question = q.q
                dumpQuest.ans_intput_type = q.q_ans_input_type.type
                dumpQuest.action = ''
                filteredQuests.push(dumpQuest)
            })
        }
        _questionnaires.value = filteredQuests
    }

    const handleGetQuestionnaires = async () => {
        storeLoading(true)
        const response = await API.questionnaire.getAll()
        storeQuestionnaires(response)
        storeLoading(false)
    }

    const handleGetQuestionnaire = async (id) => {
        storeLoading(true)
        const response = await API.questionnaire.get(id)
        storeQuestionnaire(response)
        storeLoading(false)
    }

    const handleStoreQuestionnaire = async (formData) => {
        storeLoading(true)
        const response = await API.questionnaire.store(formData)
        if(response) {
            storeSuccess(response)
        } else {
            storeError(response)
        }
        storeLoading(false)
    }

    const handleUpdateQuestionnaire = async (id, formData) => {
        storeLoading(true)
        const response = await API.questionnaire.update(id, formData)
        if(response) {
            storeSuccess(response)
        } else {
            storeError(response)
        }
        storeLoading(false)
    }

    const handleDestroyQuestionnaire = async (id) => {
        storeLoading(true)
        const response = await API.questionnaire.destroy(id)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    return {
        _error,
        _loading,
        _success,
        _questionnaire,
        _questionnaires,
        storeError,
        storeSuccess,
        handleGetQuestionnaire,
        handleGetQuestionnaires,
        handleStoreQuestionnaire,
        handleUpdateQuestionnaire,
        handleDestroyQuestionnaire
    }

})