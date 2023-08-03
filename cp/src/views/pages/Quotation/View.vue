<script setup>
import { APP } from '@/config.js'
import { useQuasar } from 'quasar'
import { ref, watch, watchEffect, computed, onMounted } from 'vue'
import { useQuotationStore } from '@/stores/quotation'

const $q = useQuasar()
const quoteStore = useQuotationStore()
const id = computed(() => APP.decryptID(quoteStore.router.currentRoute._value.params.id.toString()))

const quote = ref(null)

const consitionMessage = ref('条件を追加しない場合、この見積もりは任意の条件で計算されます。')
const formulaMessage = ref('何も計算式を追加しない場合、この見積書は自己金額で計算されます。')
const conditionQqID = ref([])
const conditionSymbols = ref([])
const conditionAnsID = ref([])
const conditionAnsFirstItem = {'label': 'どれでも', 'value': -1}
const conditionAnsSelectOrText = ref([])

const groupedQas = ref([])
const conditionSelectedQqID = ref([])

const checkConditions = ref([])
const formulas = ref([])
const parentSelect = ref([
    { label: 'なし', value: 0 },
])
const parentSelectRef = ref({ label: 'なし', value: 0 })
const formData = ref({
    'qName': '',
    'conditionString': '',
    'totalFormula': '',
    'condition': checkConditions.value,
    'formula': formulas.value,
    'baseAmount': 0,
    'qParent': parentSelectRef.value,
})

const setFormData = () => {
    resetForm()
    const newValue = quoteStore._quotation
    quote.value = quoteStore._quotation
    formData.value.qName = newValue.q_name
    formData.value.totalFormula = newValue.formula_total
    formData.value.baseAmount = newValue.base_amount
    formData.value.conditionString = newValue.condition

    // condition
    const conditions = newValue.quotation_conditions_with_all
    if (conditions != null && Object.keys(conditions).length > 0) {
        const groupedData = conditions.reduce((groups, item) => {
            const { condition_id } = item
            if (!groups[condition_id]) {
                groups[condition_id] = []
            }
            groups[condition_id].push(item)
            return groups
        }, {})
        Object.keys(groupedData).forEach(condition_id => {
            const group = groupedData[condition_id]
            const dumpC = {}
            if (group.length > 0) {
                group.forEach((g) => {
                    if (dumpC.hasOwnProperty('conQqID')) {
                        dumpC.id.push({ value: g.id, qid: g.qq_id })
                        dumpC.conQqID.push({ label: 'Q' + g.qq.qindex, value: g.qq_id })
                    } else {
                        dumpC.id = [{ value: g.id, qid: g.qq_id }]
                        dumpC.conQqID = [{ label: 'Q' + g.qq.qindex, value: g.qq_id }]
                    }
                    dumpC.conSymbol = { label: g.math_symbol.jp_name, value: g.math_symbol_id }
                    if(g.qa != null) {
                        dumpC.conAnsID = { label: g.qa.label, value: g.qa_id }
                    } else if(g.qa_any == 1) {
                        dumpC.conAnsID = { label: 'どれでも', value: -1 }
                    } else if(g.qa_value != null) {
                        dumpC.conAnsValue = g.qa_value
                    }
                })
            }
            checkConditions.value.push(dumpC)
        })
    }
    formData.value.condition = checkConditions.value

    // formula
    const dFormulas = newValue.quotation_formulas_with_all
    if (dFormulas != null && Object.keys(dFormulas).length > 0) {
        dFormulas.forEach(dF => {
            const dumpDF = {}
            dumpDF.id = dF.id
            dumpDF.text = dF.formula
            dumpDF.fcondition = []
            if (dF.quotation_formula_conditions != null && dF.quotation_formula_conditions.length > 0) {
                const dumpDFCondition = dF.quotation_formula_conditions
                dumpDFCondition.forEach((dfc) => {
                    const dumpDFC = {}
                    dumpDFC.id = dfc.id
                    dumpDFC.fconSymbol = { label: dfc.math_symbol.jp_name, value: dfc.math_symbol_id }
                    dumpDFC.fconSituation = dfc.situation
                    dumpDFC.fconResult = dfc.result
                    dumpDF.fcondition.push(dumpDFC)
                })
            }
            formulas.value.push(dumpDF)
        })

    }
    formData.value.formula = formulas.value

    if (newValue.parent != null) {
        parentSelectRef.value = {
            'label': newValue.parent.q_name,
            'value': newValue.parent.id
        }
        formData.value.qParent = parentSelectRef.value
    }

    if (quoteStore._symbols.length > 0) {
        conditionSymbols.value = quoteStore._symbols
    }

    if (quoteStore._qqs.length > 0) {
        conditionQqID.value = quoteStore._qqs
    }

    groupedQas.value = quoteStore._qas
    parentSelect.value = quoteStore._quotationIDs

    if (checkConditions.value.length > 0) {
        checkConditions.value.forEach((cc) => {
            if (cc?.conQqID && cc.conQqID.length > 0) {
                const dumpCCC = []
                cc.conQqID.forEach((ccc) => {
                    dumpCCC.push(ccc.value)
                })
                conditionSelectedQqID.value.push(dumpCCC)
            }
        })
    }


    if(conditionSelectedQqID.value.length > 0) {
        if(conditionSelectedQqID.value.length > 0) {
            conditionSelectedQqID.value.forEach((el, index) => {
                const filteredAnsID = []
                
                if(el.length > 1) { 
                    filteredAnsID.push(conditionAnsFirstItem)
                    el.forEach((ee) => {
                        const key = 'q-'+ee
                        if(groupedQas.value[key] != undefined) {
                            groupedQas.value[key].forEach((eg, i) => {
                                if (!filteredAnsID.some(fAID => fAID.label === eg.label)) {
                                    const dumpEl = {
                                        'label': eg.label,
                                        'value': eg.value
                                    }
                                    filteredAnsID.push(dumpEl)
                                }
                            })
                        }
                    })
                    conditionAnsID.value[index] = filteredAnsID 
                } else {
                    const key = 'q-'+el
                    if(groupedQas.value[key] != undefined) {
                        groupedQas.value[key].forEach((el, i) => {
                            if(el.label != null) {
                                conditionAnsSelectOrText.value[index] = false
                                if(i == 0) {
                                    filteredAnsID.push(conditionAnsFirstItem)
                                }
                                if (!filteredAnsID.some(fAID => fAID.label === el.label)) {
                                    const dumpEl = {
                                        'label': el.label,
                                        'value': el.value
                                    }
                                    filteredAnsID.push(dumpEl)
                                }
                            } else {
                                conditionAnsSelectOrText.value[index] = true
                            }
                        })
                        conditionAnsID.value[index] = filteredAnsID 

                    }else {
                        conditionAnsID.value[index] = []
                    }
                }

                
            })
        } 
    }

}

// set formData
// watch(
//     () => quoteStore._quotation,
//     (newValue, oldValue) => {
//         if (newValue != null) {
//             setFormData()
//         }
//     }, {
//     deep: true
// }
// )

onMounted(async () => {
    // fetch
    await quoteStore.handleGetAllRequired()
    await quoteStore.handleGetQuotation(id.value)
    setFormData()
})

const addMoreCheckCondition = () => {

    conditionAnsSelectOrText.value.push(false)
    checkConditions.value.push({
        conQqID: null,
        conSymbol: null,
        conAnsID: null,
        conAnsValue: null
    })
    conditionSelectedQqID.value.push([])
    conditionAnsID.value.push([])

    // check the indexs
    let conditionString = ''
    for (let index = 0; index < checkConditions.value.length; index++) {
        conditionString += 'C' + (index + 1) + '&&'
    }
    let modifiedStr1 = conditionString.replace(/&&$/, "");
    let modifiedStr2 = modifiedStr1.replace(/||$/, "");

    formData.value.conditionString = modifiedStr2
}
const handleRemoveChechCondition = (cc) => {
    const index = checkConditions.value.indexOf(cc)
    if (index !== -1) {
        checkConditions.value.splice(index, 1);
        conditionAnsSelectOrText.value.splice(index, 1)
    }

    // check the indexs
    let conditionString = ''
    for (let index = 0; index < checkConditions.value.length; index++) {
        conditionString += 'C' + (index + 1) + '&&'
    }
    let modifiedStr1 = conditionString.replace(/&&$/, "");
    let modifiedStr2 = modifiedStr1.replace(/||$/, "");

    formData.value.conditionString = modifiedStr2
}
const addMoreFormula = () => {
    formulas.value.push({
        id: null,
        text: null,
        fcondition: [],
    })
    if (formulas.value.length == 1) {
        formData.value.totalFormula = 'F1'
    }
}
const handleRemoveFormula = (f) => {
    const index = formulas.value.indexOf(f)
    if (index !== -1) {
        formulas.value.splice(index, 1);
    }
    if (formulas.value.length <= 0) {
        formData.value.totalFormula = ''
    }
}
const addMoreFormulaResultCondition = (fCondition) => {
    fCondition.push({
        id: null,
        fconSymbol: '',
        fconSituation: '',
        fconResult: ''
    })
}
const handleRemoveFormulaResultCondition = (fCondition, frCondition) => {
    const index = fCondition.indexOf(frCondition)
    if (index !== -1) {
        fCondition.splice(index, 1);
    }
}

// Watch for fetch
watch(
    () => quoteStore._symbols,
    (newValue, oldValue) => {
        if (newValue.length > 0) {
            conditionSymbols.value = newValue
        }
    }
)
watch(
    () => quoteStore._qqs,
    (newValue, oldValue) => {
        if (newValue.length > 0) {
            conditionQqID.value = newValue
        }
    }
)
watch(
    () => quoteStore._qas,
    (newValue, oldValue) => {
        groupedQas.value = newValue
    }
)
watch(
    () => quoteStore._quotationIDs,
    (newValue, oldValue) => {
        parentSelect.value = newValue
    }
)
watch(
  () => conditionSelectedQqID.value,
  (newValue, oldValue) => {
    if(newValue.length > 0) {
        newValue.forEach((el, index) => {
            if(el.length <= 0) {
                conditionAnsID.value[index] = null
            }
        })
    }
  }, {
    deep: true
  }
)

// Events
function checkMainArray(mainArray, checkArray) {
    const mArray = mainArray.id
    return mArray.filter(mainItem => {
        for (const checkItem of checkArray) {
            if (mainItem.qid == checkItem[0]) {
                return true;
            } 
        }
        return false;
    })
}
const setAnsIDByQqID = (index, cc) => {
    const newValue = conditionSelectedQqID.value[index]
    if (newValue.length > 0) {
        const filteredAnsID = [
            conditionAnsFirstItem
        ]
        newValue.forEach((el) => {
            const key = 'q-' + el
            if (groupedQas.value[key] != undefined) {
                groupedQas.value[key].forEach((el) => {
                    if(el.label != null) {
                        conditionAnsSelectOrText.value[index] = false
                        if (!filteredAnsID.some(fAID => fAID.label === el.label)) {
                            const dumpEl = {
                                'label': el.label,
                                'value': el.value
                            }
                            filteredAnsID.push(dumpEl)
                        }
                    } else {
                        conditionAnsSelectOrText.value[index] = true
                        if(cc.conQqID.length > 1) {
                            cc.conQqID = [cc.conQqID[cc.conQqID.length - 1]]
                            conditionSelectedQqID.value[index] = []
                            cc.conQqID.forEach((el, i) => {
                                conditionSelectedQqID.value[index].push(el.value)
                            })
                        }
                    }
                })
            }
        })
        conditionAnsID.value[index] = filteredAnsID
    } else {
        conditionAnsID.value[index] = []
    }

    // remove the selected ans from formData
    checkConditions.value[index].conAnsID = null
}
const updateConditionQq = (value, cc) => {
    const index = checkConditions.value.indexOf(cc)
    if (value.length > 0) {
        conditionSelectedQqID.value[index] = []
        value.forEach((el) => {
            conditionSelectedQqID.value[index].push(el.value)
        })
        setAnsIDByQqID(index, cc)
    }
}
const removeConditionQq = (value, cc) => {
    const indexCC = checkConditions.value.indexOf(cc)
    if (indexCC < conditionSelectedQqID.value.length) {
        const index = conditionSelectedQqID.value[indexCC].indexOf(value.value)
        if (index == -1) {
            conditionSelectedQqID.value[indexCC].splice(value.index, 1);
        }
    }

    if (checkConditions.value[indexCC].conQqID.length <= 1) {
        checkConditions.value[indexCC].conAnsID = null
    }
    
    const filteredMain = checkMainArray(checkConditions.value[indexCC], conditionSelectedQqID.value)
    checkConditions.value[indexCC].id = filteredMain
}
const updateConditionSymbol = (value, cc) => {
    const index = checkConditions.value.indexOf(cc)
    if(value.label == "同等") {
        if(conditionAnsID.value[index][0].label == "どれでも") {
            conditionAnsID.value[index][0].disable = false
        }
    } else {
        if(conditionAnsID.value[index][0].label == "どれでも") {
            conditionAnsID.value[index][0].disable = true
            if(checkConditions.value[index].conAnsID != null && checkConditions.value[index].conAnsID.label == "どれでも") {
                checkConditions.value[index].conAnsID = null
            }
        }
    }
}
const updateConditionAnsID = (value, cc, type) => {
    let foundKey = []
    const targetValue = value
    const index = checkConditions.value.indexOf(cc)
    conditionSelectedQqID.value[index].forEach((item) => {
        if (groupedQas.value.hasOwnProperty('q-' + item)) {
            const arr = groupedQas.value['q-' + item]
            if (arr.some(item => item.label === targetValue.label)) {
                foundKey.push('q-' + item)
            }
        }
    })

    if (foundKey.length > 0) {
        const convertedArray = foundKey.map(item => parseInt(item.split('-')[1]))
        // remove unselected qq
        cc.conQqID = cc.conQqID.filter(item => convertedArray.includes(item.value))
        // remove unselected answers by qq
        conditionAnsID.value[index] = foundKey.reduce((acc, key) => {
            groupedQas.value[key].forEach(item => {
                if (!acc.labels[item.label]) {
                    acc.labels[item.label] = true;
                    acc.array.push(item);
                }
            })
            return acc
        }, { array: [], labels: {} }).array
    }
}

// watch the loading
watchEffect(() => {
    if (quoteStore._loading) {
        $q.loading.show()
    } else {
        $q.loading.hide()
    }

}, [quoteStore._loading])

const resetForm = () => {
    formData.value.qName = ''
    formData.value.totalFormula = ''
    formData.value.qParent = parentSelect.value[0]
    checkConditions.value = []
    formulas.value = []
    conditionQqID.value = []
    conditionSymbols.value = []
    conditionAnsID.value = []
    groupedQas.value = []
    conditionSelectedQqID.value = []
    formData.baseAmount = 0
}

// submit the form
const onSubmit = async () => {
    const dumpFormData = {}
    Object.entries(formData.value).forEach(([key1, dataValue1]) => {
        if (typeof dataValue1 === "string") { //string
            dumpFormData[key1] = dataValue1
        } else if (Array.isArray(dataValue1)) { //array
            if (key1 == 'condition') { //condition
                dumpFormData[key1] = []
                if (dataValue1.length > 0) {
                    dataValue1.forEach((el1, index1) => {
                        dumpFormData[key1][index1] = {}
                        Object.entries(el1).forEach(([key2, dataValue2]) => {
                            if (typeof dataValue2 === "string") { //string
                                dumpFormData[key1][index1][key2] = dataValue2
                            } else if (Array.isArray(dataValue2)) { //array
                                dumpFormData[key1][index1][key2] = dataValue2.map(item => item.value)
                            } else { //object
                                if(key2 == 'conAnsID') {
                                    dumpFormData[key1][index1][key2] = dataValue2
                                } else if(key2 == 'conAnsValue') {
                                    dumpFormData[key1][index1][key2] = dataValue2
                                } else {
                                    if (dataValue2 != null) {
                                        dumpFormData[key1][index1][key2] = dataValue2.value
                                    } else {
                                        dumpFormData[key1][index1][key2] = dataValue2
                                    }
                                }
                            }
                        })

                    })
                }
            } else { // formula
                dumpFormData[key1] = []
                if (dataValue1.length > 0) {
                    dataValue1.forEach((el1, index1) => {
                        dumpFormData[key1][index1] = {}
                        Object.entries(el1).forEach(([key2, dataValue2]) => {
                            if (typeof dataValue2 === "string") { //string
                                dumpFormData[key1][index1][key2] = dataValue2
                            } else if (Array.isArray(dataValue2)) { //array
                                dumpFormData[key1][index1][key2] = []
                                if (dataValue2.length > 0) {
                                    dataValue2.forEach((el2, index2) => {
                                        if (typeof el2 === "object" && el2 !== null) { //object
                                            dumpFormData[key1][index1][key2][index2] = {}
                                            Object.entries(el2).forEach(([key3, dataValue3]) => {
                                                if(dataValue3 == null) {
                                                    dumpFormData[key1][index1][key2][index2][key3] = dataValue3
                                                } else if (typeof dataValue3 === "object") { //string
                                                    dumpFormData[key1][index1][key2][index2][key3] = dataValue3.value
                                                } else { // object
                                                    dumpFormData[key1][index1][key2][index2][key3] = dataValue3
                                                }
                                            })
                                        }
                                    })
                                }
                            } else {
                                dumpFormData[key1][index1][key2] = dataValue2
                            }
                        })

                    })
                }
            }
        } else if (typeof dataValue1 === "object" && dataValue1 !== null) { // object
            dumpFormData[key1] = dataValue1.value
        }
    })

    await quoteStore.handleUpdateQuotation(id.value, dumpFormData)

    // check result
    if (quoteStore._success) {
        await quoteStore.handleGetAllRequired()
        await quoteStore.handleGetQuotation(id.value)
        setFormData()
        $q.notify({
            caption: '見積書が正常に作成されました',
            message: '成功！',
            type: 'positive',
            timeout: 1000
        })
        quoteStore.storeSuccess(false)
        quoteStore.reset()
        await quoteStore.handleGetAllRequired()
        await quoteStore.handleGetQuotation(id.value)

        // resetForm()
        // quoteStore.router.replace({ name: 'cp.quotation' })
    }

    if (quoteStore._error) {
        $q.notify({
            caption: 'エラーが発生しました。後でもう一度お試しください。',
            message: 'エラー！',
            type: 'negative',
            timeout: 1000
        })
        quoteStore.storeError(false)
    }
}

</script>
<template>
    <div class="full-width  q-mb-xl">
        <div class="q-pa-sm row items-start q-gutter-md">
            <q-breadcrumbs>
                <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
                <q-breadcrumbs-el label="アンケート" />
            </q-breadcrumbs>
        </div>
        <div class="full-width row wrap justify-start items-start content-start">
            <div class="q-px-md row">
                <q-toolbar>
                    <q-toolbar-title class="page-ttl">
                        見積書の作成
                    </q-toolbar-title>
                </q-toolbar>
            </div>
            <div class="full-width row q-px-md q-mt-md">
                <div class="col-12">
                    <q-card class="common-card">
                        <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
                            <div class="common-card-ttl"></div>
                        </q-card-section>
                        <q-card-section class="q-px-none">
                            <q-form @submit="onSubmit" class="q-gutter-md">
                                <div class="row q-px-lg q-mt-none">
                                    <div class="col-12">
                                        <div class="row">
                                            <div class="col-12">
                                                <label>見積書のタイトル<small class="required-suffix">※必須</small></label>
                                            </div>
                                            <div class="col-12 q-mt-sm">
                                                <q-input outlined class="common-input-text" v-model="formData.qName"
                                                    lazy-rules dense :rules="[
                                                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                                                    ]" />
                                            </div>
                                        </div>
                                        <div class="row q-mt-md">
                                            <div class="col-12 q-mb-md">
                                                <label>お見積りの条件</label>
                                            </div>
                                            <div class="col-12 q-mb-sm" v-for="(cc, index) in checkConditions" :key="index">
                                                <q-list bordered class="rounded-borders">
                                                    <q-expansion-item dense dense-toggle switch-toggle-side
                                                        expand-icon-toggle>
                                                        <template v-slot:header>
                                                            <div
                                                                class="q-item__section column q-item__section--main justify-center">
                                                                <div class="q-item__label">調子 ( C{{ index + 1 }} )</div>
                                                                <!---->
                                                            </div>
                                                            <div
                                                                class="q-item__section column q-item__section--side justify-center">
                                                                <q-btn dense size="sm" flat>
                                                                    <q-icon color="negative" name="mdi-trash-can-outline"
                                                                        @click="handleRemoveChechCondition(cc)" />
                                                                </q-btn>
                                                            </div>

                                                        </template>
                                                        <q-card>
                                                            <q-card-section>
                                                                <div class="row q-col-gutter-md">
                                                                    <div
                                                                        class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                                        <div>質問</div>
                                                                        <q-select multiple use-chips dense outlined
                                                                            v-model="cc.conQqID" :options="conditionQqID"
                                                                            @update:model-value="(value) => updateConditionQq(value, cc)"
                                                                            @remove="(value) => removeConditionQq(value, cc)"
                                                                            lazy-rules :rules="[
                                                                                val => val != null || 'フィールドは必須項目です',
                                                                            ]" />
                                                                    </div>
                                                                    <div
                                                                        class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                                        <div>の場合</div>
                                                                        <q-select dense outlined v-model="cc.conSymbol"
                                                                            @update:model-value="(value) => updateConditionSymbol(value, cc)"
                                                                            :options="conditionSymbols" lazy-rules :rules="[
                                                                                val => val != null || 'フィールドは必須項目です',
                                                                            ]" />
                                                                    </div>
                                                                    <div
                                                                        class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                                        <div>答え</div>
                                                                        <template v-if="conditionAnsSelectOrText[index]">
                                                                            <q-input  
                                                                                outlined 
                                                                                class="common-input-text" 
                                                                                v-model="cc.conAnsValue"
                                                                                @update:model-value="(value) => updateConditionAnsID(value, cc, 'text')"
                                                                                lazy-rules
                                                                                dense
                                                                                :rules="[
                                                                                    val => (val != null) || 'フィールドは必須項目です', 
                                                                                ]"
                                                                            />
                                                                        </template>
                                                                        <template v-else>
                                                                            <q-select dense outlined v-model="cc.conAnsID"
                                                                            :options="conditionAnsID[index]"
                                                                            @update:model-value="(value) => updateConditionAnsID(value, cc, 'select')"
                                                                            lazy-rules :rules="[
                                                                                val => val != null || 'フィールドは必須項目です',
                                                                            ]" />
                                                                        </template>
                                                                    </div>
                                                                </div>
                                                            </q-card-section>
                                                        </q-card>
                                                    </q-expansion-item>
                                                </q-list>
                                            </div>
                                            <div class="col-12 q-mt-sm">
                                                <q-btn @click="addMoreCheckCondition" flat size="md" color="primary"
                                                    icon="mdi-plus" label="条件を追加" />
                                            </div>
                                            <div class="col-12 q-mt-sm">
                                                <p class="text-caption text-grey">{{ consitionMessage }}</p>
                                            </div>
                                        </div>
                                        <div class="row q-mt-md">
                                            <div class="col-12">
                                                <label>確認すべき条件</label>
                                            </div>
                                            <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 q-mt-sm q-mt-sm">
                                                <q-input type="text" outlined class="common-input-text"
                                                    v-model="formData.conditionString" lazy-rules dense />
                                                <span class="text-caption text-grey">(「and」は「&&」、「or」は「||」)</span>
                                            </div>
                                        </div>
                                        <div class="row q-mt-md">
                                            <div class="col-12 q-mb-md">
                                                <label>見積り式</label>
                                            </div>
                                            <div class="col-12 q-mb-sm" v-for="(f, index) in formulas" :key="index">
                                                <q-list bordered class="rounded-borders">
                                                    <q-expansion-item dense dense-toggle switch-toggle-side
                                                        expand-icon-toggle>
                                                        <template v-slot:header>
                                                            <div
                                                                class="q-item__section column q-item__section--main justify-center">
                                                                <div class="q-item__label">式 ( F{{ index + 1 }} )</div>
                                                                <!---->
                                                            </div>
                                                            <div
                                                                class="q-item__section column q-item__section--side justify-center">
                                                                <q-btn dense size="sm" flat>
                                                                    <q-icon color="negative" name="mdi-trash-can-outline"
                                                                        @click="handleRemoveFormula(f)" />
                                                                </q-btn>
                                                            </div>

                                                        </template>
                                                        <q-card>
                                                            <q-card-section>
                                                                <div class="row q-col-gutter-md">
                                                                    <div class="col-12">
                                                                        <div>数式テキスト</div>
                                                                        <q-input dense outlined v-model="f.text" />
                                                                    </div>
                                                                    <div class="col-12">
                                                                        <div class="col-12 q-mb-sm"
                                                                            v-for="(frc, index) in f.fcondition"
                                                                            :key="index">
                                                                            <q-list bordered class="rounded-borders">
                                                                                <q-expansion-item dense dense-toggle
                                                                                    switch-toggle-side expand-icon-toggle>
                                                                                    <template v-slot:header>
                                                                                        <div
                                                                                            class="q-item__section column q-item__section--main justify-center">
                                                                                            <div class="q-item__label">結果の条件
                                                                                            </div><!---->
                                                                                        </div>
                                                                                        <div
                                                                                            class="q-item__section column q-item__section--side justify-center">
                                                                                            <q-btn dense size="sm" flat>
                                                                                                <q-icon color="negative"
                                                                                                    name="mdi-trash-can-outline"
                                                                                                    @click="handleRemoveFormulaResultCondition(f.fcondition, frc)" />
                                                                                            </q-btn>
                                                                                        </div>
                                                                                    </template>
                                                                                    <q-card>
                                                                                        <q-card-section>
                                                                                            <div
                                                                                                class="row q-col-gutter-md">
                                                                                                <div
                                                                                                    class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                                                                    <div>の場合</div>
                                                                                                    <q-select dense outlined
                                                                                                        v-model="frc.fconSymbol"
                                                                                                        :options="conditionSymbols"
                                                                                                        lazy-rules :rules="[
                                                                                                            val => val != null || 'フィールドは必須項目です',
                                                                                                        ]" />
                                                                                                </div>
                                                                                                <div
                                                                                                    class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                                                                    <div>状態</div>
                                                                                                    <q-input type="number"
                                                                                                        dense outlined
                                                                                                        v-model="frc.fconSituation"
                                                                                                        lazy-rules :rules="[
                                                                                                            val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です'
                                                                                                        ]" />
                                                                                                </div>
                                                                                                <div
                                                                                                    class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                                                                    <div>結果</div>
                                                                                                    <q-input type="number"
                                                                                                        dense outlined
                                                                                                        v-model="frc.fconResult"
                                                                                                        lazy-rules :rules="[
                                                                                                            val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です'
                                                                                                        ]" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </q-card-section>
                                                                                    </q-card>
                                                                                </q-expansion-item>
                                                                            </q-list>
                                                                        </div>
                                                                        <q-btn
                                                                            @click="addMoreFormulaResultCondition(f.fcondition)"
                                                                            flat size="md" color="primary" icon="mdi-plus"
                                                                            label="数式の結果に条件を追加する" />
                                                                    </div>
                                                                </div>
                                                            </q-card-section>
                                                        </q-card>
                                                    </q-expansion-item>
                                                </q-list>
                                            </div>
                                            <div class="col-12 q-mt-sm">
                                                <q-btn @click="addMoreFormula" flat size="md" color="primary"
                                                    icon="mdi-plus" label="数式を追加" />
                                            </div>
                                            <div class="col-12 q-mt-sm">
                                                <p class="text-caption text-grey">{{ formulaMessage }}</p>
                                            </div>
                                        </div>
                                        <div class="row q-mt-md">
                                            <div class="col-12">
                                                <label>合計の計算式 </label>
                                            </div>
                                            <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 q-mt-sm q-mt-sm">
                                                <q-input outlined class="common-input-text" v-model="formData.totalFormula"
                                                    dense />
                                                <span class="text-caption text-grey">( F1+F2 )</span>
                                            </div>
                                        </div>
                                        <div class="row q-mt-md">
                                            <div class="col-12">
                                                <label>基本額<small class="required-suffix">※必須</small></label>
                                            </div>
                                            <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 q-mt-sm q-mt-sm">
                                                <q-input type="number" outlined class="common-input-text"
                                                    v-model="formData.baseAmount" lazy-rules dense :rules="[
                                                        val => val != 0 && val != '' && !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                                                    ]" />
                                            </div>
                                        </div>
                                        <div class="row q-mt-md">
                                            <div class="col-12">
                                                <label>ウェブサイト名</label>
                                            </div>
                                            <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 q-mt-sm">
                                                <q-select outlined v-model="formData.qParent" :options="parentSelect"
                                                    lazy-rules dense />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input q-mt-xl">
                                        <q-btn type="submit" class="p-common-btn" label="新規作成" />
                                    </div>
                                </div>
                            </q-form>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.form-input {
    .q-field__control {
        height: 40px !important;
    }

    .q-field__marginal {
        height: 40px !important;
    }

    input {
        padding: 0px 5px;
        font-size: 16px;
    }

    .q-field--auto-height .q-field__control,
    .q-field--auto-height .q-field__native {
        min-height: 40px !important;
    }
}

.form-select {
    margin-bottom: 20px;
}
</style>