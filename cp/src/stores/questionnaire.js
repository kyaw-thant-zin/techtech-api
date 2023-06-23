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
                'suffix': '',
                'inputType': '',
                'required': '',
                'choice': ''
            },
            'textItems': {
                'suffix': '',
            },
            'selectItems': [],
            'choiceItems': []
        }

        if(questionnaire != null) {
            // set formData
            q.formData.question = questionnaire.q
            q.formData.suffix = questionnaire.suffix
            q.formData.required = questionnaire.required == 1 ? true:false
            
            const qFormInputType = questionnaire.q_ans_input_type.type
            q.formData.inputType = qFormInputType 
            const qAll = questionnaire.qas
            if(qAll != null && qAll.length > 0) {
                qAll.forEach(qT => {
                    if(qFormInputType == 'テキスト') {
                        // input text
                        q.textItems.suffix = qT.suffix
                    } else if(qFormInputType == '選択') {
                        // input select
                        const dumpSelectItem = {
                            'label': qT.label,
                            'unit_price': qT.unit_price,
                        }
                        q.selectItems.push(dumpSelectItem)
                    } else if(qFormInputType == '選択肢') {
                        // input choice
                        q.formData.choice = questionnaire.choice == 1 ? '独身':'多数'
                        const dumpChoiceItem = {
                            label: qT.label,
                            imagePath: qT.image != null ? APP.ACTIVE_PUBLIC_SITE_URL+'/'+qT.image:null,
                            unit_price: qT.unit_price,
                        }
                        q.choiceItems.push(dumpChoiceItem)
                    }
                });
            } else {
                
            }
        }
        _questionnaire.value = q
    }

    const storeQuestionnaires = (questionnaires) => {
        const filteredQuests = []
        if(questionnaires.length > 0) {
            questionnaires.forEach((q, index) => {
                const dumpQuest = {}
                const qInputType = q.q_ans_input_type.type
                const qChoice = q.q_ans_input_type.type == 'ラジオボタン' ? '独身':'多数'
                dumpQuest.index = questionnaires.length - index
                dumpQuest.id = q.id
                dumpQuest.question = q.q
                dumpQuest.ans_intput_type = qInputType == 'ラジオボタン' || qInputType == 'チェックボックス' ? qInputType+'（'+qChoice+'）':qInputType
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
        console.log(response)
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