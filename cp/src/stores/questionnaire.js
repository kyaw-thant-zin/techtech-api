import { ref } from 'vue'
import { defineStore } from 'pinia'
import { APP } from '@/config.js'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useQuestionnaireStore = defineStore('questionnaire', () => {

    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _questionnaires = ref(null)
    const _questionnaire = ref(null)
    const _questionnaireTablePage = ref(useLocalStorage('questionnaire_table_page', 1))
    // for create and edit
    const _qindex = ref(0)
    const _qqs = ref(null)

    const reset = () => {
        _loading.value = false
        _success.value = false
        _error.value = false
        _questionnaires.value = null
        _questionnaire.value = null
        // for create and edit
        _qindex.value = 0
        _qqs.value = null
    }

    const storeTablePagiPage = (pNumber) => {
        _questionnaireTablePage.value = pNumber
    }

    const storeQindex = (qindex) => {
        _qindex.value = qindex
    }

    const storeQqs = (qqs) => {
        let dumpQqs = null
        if(qqs.length > 0) {
            dumpQqs = []
            qqs.forEach((q) => {
                const dQq = {
                    'label': 'Q'+q.qindex+'.'+q.q,
                    'value': q.id
                }
                dumpQqs.push(dQq)
            })
        }
        _qqs.value = dumpQqs
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

    const storeQuestionnaire = (questionnaire) => {
        const q = {
            'formData': {
                'qindex': '',
                'question': '',
                'suffix': '',
                'inputType': '',
                'required': '',
                'choice': ''
            },
            'textItems': {
                'id': null,
                'suffix': '',
                'controllable': false,
                'controlled_id': null
            },
            'selectItems': [],
            'choiceItems': [],
        }

        if(questionnaire != null) {
            // set formData
            q.formData.qindex = 'Q'+questionnaire.qindex
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
                        q.textItems.id = qT.id
                        q.textItems.controllable = qT.control == 1 ? true:false
                        q.textItems.controlled_id = qT?.controlled != null ? {
                            'label': 'Q'+qT?.controlled?.qindex+'.'+qT?.controlled?.q,
                            'value': qT?.controlled?.id
                        } : null
                    } else if(qFormInputType == '選択') {
                        // input select
                        const dumpSelectItem = {
                            'label': qT.label,
                            'unit_price': qT.unit_price,
                            'id': qT.id,
                            'controllable': qT.control == 1 ? true:false,
                            'controlled_id': qT?.controlled != null ? {
                                'label': 'Q'+qT?.controlled?.qindex+'.'+qT?.controlled?.q,
                                'value': qT?.controlled?.id
                            } : null
                        }
                        q.selectItems.push(dumpSelectItem)
                    } else if(qFormInputType == '選択肢') {
                        // input choice
                        q.formData.choice = questionnaire.choice == 1 ? '独身':'多数'
                        const dumpChoiceItem = {
                            label: qT.label,
                            imagePath: qT.image != null ? APP.ACTIVE_PUBLIC_SITE_URL+'/'+qT.image:null,
                            unit_price: qT.unit_price,
                            id: qT.id,
                            controllable: qT.control == 1 ? true:false,
                            controlled_id: qT?.controlled != null ? {
                                'label': 'Q'+qT?.controlled?.qindex+'.'+qT?.controlled?.q,
                                'value': qT?.controlled?.id
                            } : null
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
                dumpQuest.index = q.qindex
                dumpQuest.qindex = 'Q'+q.qindex
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

    const handleGetQAndLastQindex = async () => {
        storeLoading(true)
        const response = await API.questionnaire.getQAndLastQindex()
        if(response) {
            storeQindex(response.qLastIndex)
            storeQqs(response.qq)
            storeSuccess(true)
            storeError(false)
        } else {
            storeSuccess(false)
            storeError(true)
        }
        storeLoading(false)
    }

    return {
        _qqs,
        _qindex,
        _error,
        _loading,
        _success,
        _questionnaire,
        _questionnaires,
        _questionnaireTablePage,
        reset,
        storeError,
        storeSuccess,
        handleGetQuestionnaire,
        handleGetQuestionnaires,
        handleStoreQuestionnaire,
        handleUpdateQuestionnaire,
        handleDestroyQuestionnaire,
        handleGetQAndLastQindex,
        storeTablePagiPage
    }

})