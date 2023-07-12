<script setup>
import { useQuasar } from 'quasar'
import { ref, watch, watchEffect } from 'vue' 
import { useQuotationStore } from '@/stores/quotation'

const $q = useQuasar()
const quoteStore = useQuotationStore()

// fetch
quoteStore.handleGetAllRequired()


const consitionMessage = ref('条件を追加しない場合、この見積もりは任意の条件で計算されます。')
const formulaMessage = ref('何も計算式を追加しない場合、この見積書は自己金額で計算されます。')
const conditionQqID = ref([])
const conditionSymbols = ref([])
const conditionAnsID = ref([])

const groupedQas = ref([])
const conditionSelectedQqID = ref([])

const checkConditions = ref([])
const formulas = ref([])
const parentSelect = ref([
    {label: 'なし', value: 0},
])
const formData = ref({
    'qName': '',
    'conditionString': '',
    'totalFormula': '',
    'condition': checkConditions.value,
    'formula': formulas.value,
    'baseAmount': 0,
    'qParent': parentSelect.value[0],
})

const addMoreCheckCondition = () => {
    checkConditions.value.push({
        conQqID: null,
        conSymbol: null,
        conAnsID: null
    })
    conditionSelectedQqID.value.push([])
    conditionAnsID.value.push([])

    // check the indexs
    let conditionString = ''
    for (let index = 0; index < checkConditions.value.length; index++) {
        conditionString += 'C'+(index + 1)+'&&'
    }
    let modifiedStr1 = conditionString.replace(/&&$/, "");
    let modifiedStr2 = modifiedStr1.replace(/||$/, "");

    formData.value.conditionString = modifiedStr2
}
const handleRemoveChechCondition = (cc) => {
    const index = checkConditions.value.indexOf(cc)
    if (index !== -1) {
        checkConditions.value.splice(index, 1);
    }
    
    // check the indexs
    let conditionString = ''
    for (let index = 0; index < checkConditions.value.length; index++) {
        conditionString += 'C'+(index + 1)+'&&'
    }
    let modifiedStr1 = conditionString.replace(/&&$/, "");
    let modifiedStr2 = modifiedStr1.replace(/||$/, "");

    formData.value.conditionString = modifiedStr2
}
const addMoreFormula = () => {
    formulas.value.push({
        text: null,
        fcondition: [],
    })
    if(formulas.value.length == 1) {
        formData.value.totalFormula = 'F1'
    }
}
const handleRemoveFormula = (f) => {
    const index = formulas.value.indexOf(f)
    if (index !== -1) {
        formulas.value.splice(index, 1);
    }
    if(formulas.value.length <= 0) {
        formData.value.totalFormula = ''
    }
}
const addMoreFormulaResultCondition = (fCondition) => {
    fCondition.push({
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
    if(newValue.length > 0) {
        conditionSymbols.value = newValue
    }
  }
)
watch(
  () => quoteStore._qqs,
  (newValue, oldValue) => {
    if(newValue.length > 0) {
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
const setAnsIDByQqID = (index) => {
    const newValue = conditionSelectedQqID.value[index]
    if(newValue.length > 0) {
        const filteredAnsID = []
        newValue.forEach((el) => {
            const key = 'q-'+el
            if(groupedQas.value[key] != undefined) {
                groupedQas.value[key].forEach((el) => {
                    if (!filteredAnsID.some(fAID => fAID.label === el.label)) {
                        const dumpEl = {
                            'label': el.label,
                            'value': el.value
                        }
                        filteredAnsID.push(dumpEl)
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
    if(value.length > 0) {
        conditionSelectedQqID.value[index] = []
        value.forEach((el) => {
            conditionSelectedQqID.value[index].push(el.value)
        })
        setAnsIDByQqID(index)
    }
}
const removeConditionQq = (value, cc) => {
    const indexCC = checkConditions.value.indexOf(cc)
    const index = conditionSelectedQqID.value[indexCC].indexOf(value.value)
    if (index == -1) {
        conditionSelectedQqID.value[indexCC].splice(value.index, 1);
    }

    if(checkConditions.value[indexCC].conQqID.length <= 1) {
        checkConditions.value[indexCC].conAnsID = null
    }
}
const updateConditionAnsID = (value, cc) => {
    let foundKey = []
    const targetValue = value
    const index = checkConditions.value.indexOf(cc)
    conditionSelectedQqID.value[index].forEach((item) => {
        if (groupedQas.value.hasOwnProperty('q-'+item)) {
            const arr = groupedQas.value['q-'+item]
            if (arr.some(item => item.label === targetValue.label)) {
                foundKey.push('q-'+item)
            }
        }
    })

    if(foundKey.length > 0) {
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
    if(quoteStore._loading) {
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
            if(key1 == 'condition') { //condition
                dumpFormData[key1] = []
                if(dataValue1.length > 0) {
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
                                } else {
                                    dumpFormData[key1][index1][key2] = dataValue2.value
                                }
                            }
                        })
                        
                    })
                }
            } else { // formula
                dumpFormData[key1] = []
                if(dataValue1.length > 0) {
                    dataValue1.forEach((el1, index1) => {
                        dumpFormData[key1][index1] = {}
                        Object.entries(el1).forEach(([key2, dataValue2]) => {
                            if (typeof dataValue2 === "string") { //string
                                dumpFormData[key1][index1][key2] = dataValue2
                            } else if (Array.isArray(dataValue2)) { //array
                                dumpFormData[key1][index1][key2] = []
                                if(dataValue2.length > 0) {
                                    dataValue2.forEach((el2, index2) => {
                                        if(typeof el2 === "object" && el2 !== null) { //object
                                            dumpFormData[key1][index1][key2][index2] = {}
                                            Object.entries(el2).forEach(([key3, dataValue3]) => {
                                                if(typeof dataValue3 === "string") { //string
                                                    dumpFormData[key1][index1][key2][index2][key3] = dataValue3
                                                } else { // object
                                                    dumpFormData[key1][index1][key2][index2][key3] = dataValue3.value
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                        
                    })
                }
            }
        } else if (typeof dataValue1 === "object" && dataValue1 !== null) { // object
            dumpFormData[key1] = dataValue1.value
        }
    })
    await quoteStore.handleStoreQuotation(dumpFormData)

    // // check result
    // if(quoteStore._success) {
    //     $q.notify({
    //         caption: '見積書が正常に作成されました',
    //         message: '成功！',
    //         type: 'positive',
    //         timeout: 1000
    //     })
    //     quoteStore.storeSuccess(false)
    //     resetForm()
    //     quoteStore.router.replace({ name: 'cp.quotation' })
    // }

    // if(quoteStore._error) {
    //     $q.notify({
    //         caption: 'エラーが発生しました。後でもう一度お試しください。',
    //         message: 'エラー！',
    //         type: 'negative',
    //         timeout: 1000
    //     })
    //     quoteStore.storeError(false)
    // }
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
                <q-form
                    @submit="onSubmit"
                    class="q-gutter-md"
                >
                    <div class="row q-px-lg q-mt-none">
                        <div class="col-12">
                            <div class="row">
                                <div class="col-12">
                                    <label>見積書のタイトル<small class="required-suffix">※必須</small></label>
                                </div>
                                <div class="col-12 q-mt-sm">
                                    <q-input  
                                        outlined 
                                        class="common-input-text" 
                                        v-model="formData.qName"
                                        lazy-rules
                                        dense
                                        :rules="[
                                            val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です', 
                                        ]"
                                    />
                                </div>
                            </div>
                            <div  class="row q-mt-md">
                                <div class="col-12 q-mb-md">
                                    <label>お見積りの条件</label>
                                </div>
                                <div class="col-12 q-mb-sm" v-for="(cc, index) in checkConditions" :key="index">
                                    <q-list bordered class="rounded-borders">
                                        <q-expansion-item
                                            dense
                                            dense-toggle
                                            switch-toggle-side
                                            expand-icon-toggle
                                        >
                                            <template v-slot:header>
                                                <div class="q-item__section column q-item__section--main justify-center">
                                                    <div class="q-item__label">調子 ( C{{ index + 1 }} )</div><!---->
                                                </div>
                                                <div class="q-item__section column q-item__section--side justify-center">
                                                    <q-btn dense size="sm" flat>
                                                        <q-icon color="negative" name="mdi-trash-can-outline" @click="handleRemoveChechCondition(cc)" />
                                                    </q-btn>
                                                </div>
                                                    
                                            </template>
                                            <q-card>
                                                <q-card-section>
                                                    <div class="row q-col-gutter-md">
                                                        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                            <div>ラベル</div>
                                                            <q-select 
                                                                multiple
                                                                use-chips
                                                                dense 
                                                                outlined 
                                                                v-model="cc.conQqID" 
                                                                :options="conditionQqID"
                                                                @update:model-value="(value) => updateConditionQq(value, cc)"
                                                                @remove="(value) => removeConditionQq(value, cc)"
                                                                lazy-rules
                                                                :rules="[
                                                                    val => val != null || 'フィールドは必須項目です', 
                                                                ]"
                                                            />
                                                        </div>
                                                        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                            <div>の場合</div>
                                                            <q-select 
                                                                dense 
                                                                outlined 
                                                                v-model="cc.conSymbol" 
                                                                :options="conditionSymbols"
                                                                lazy-rules
                                                                :rules="[
                                                                    val => val != null || 'フィールドは必須項目です', 
                                                                ]"
                                                            />
                                                        </div>
                                                        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                            <div>ラベル</div>
                                                            <q-select 
                                                                dense 
                                                                outlined 
                                                                v-model="cc.conAnsID" 
                                                                :options="conditionAnsID[index]"
                                                                @update:model-value="(value) => updateConditionAnsID(value, cc)"
                                                                lazy-rules
                                                                :rules="[
                                                                    val => val != null || 'フィールドは必須項目です', 
                                                                ]"
                                                            />
                                                        </div>
                                                    </div>
                                                    </q-card-section>
                                                </q-card>
                                            </q-expansion-item>
                                    </q-list>
                                </div>
                                <div class="col-12 q-mt-sm">
                                    <q-btn @click="addMoreCheckCondition" flat size="md" color="primary" icon="mdi-plus" label="条件を追加" />
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
                                    <q-input 
                                        type="text" 
                                        outlined 
                                        class="common-input-text" 
                                        v-model="formData.conditionString"
                                        lazy-rules
                                        dense
                                    />
                                    <span class="text-caption text-grey">(「and」は「&&」、「or」は「||」)</span>
                                </div>
                            </div>
                            <div  class="row q-mt-md">
                                <div class="col-12 q-mb-md">
                                    <label>見積り式</label>
                                </div>
                                <div class="col-12 q-mb-sm" v-for="(f, index) in formulas" :key="index">
                                    <q-list bordered class="rounded-borders">
                                        <q-expansion-item
                                            dense
                                            dense-toggle
                                            switch-toggle-side
                                            expand-icon-toggle
                                        >
                                            <template v-slot:header>
                                                <div class="q-item__section column q-item__section--main justify-center">
                                                    <div class="q-item__label">式 ( F{{ index + 1 }} )</div><!---->
                                                </div>
                                                <div class="q-item__section column q-item__section--side justify-center">
                                                    <q-btn dense size="sm" flat>
                                                        <q-icon color="negative" name="mdi-trash-can-outline" @click="handleRemoveFormula(f)" />
                                                    </q-btn>
                                                </div>
                                                    
                                            </template>
                                            <q-card>
                                                <q-card-section>
                                                    <div class="row q-col-gutter-md">
                                                        <div class="col-12">
                                                            <div>数式テキスト</div>
                                                            <q-input 
                                                                dense 
                                                                outlined 
                                                                v-model="f.text"
                                                            />
                                                        </div>
                                                        <div class="col-12">
                                                            <div class="col-12 q-mb-sm" v-for="(frc, index) in f.fcondition" :key="index">
                                                                <q-list bordered class="rounded-borders">
                                                                    <q-expansion-item
                                                                        dense
                                                                        dense-toggle
                                                                        switch-toggle-side
                                                                        expand-icon-toggle
                                                                    >
                                                                        <template v-slot:header>
                                                                            <div class="q-item__section column q-item__section--main justify-center">
                                                                                <div class="q-item__label">結果の条件</div><!---->
                                                                            </div>
                                                                            <div class="q-item__section column q-item__section--side justify-center">
                                                                                <q-btn dense size="sm" flat>
                                                                                    <q-icon color="negative" name="mdi-trash-can-outline" @click="handleRemoveFormulaResultCondition(f.fcondition, frc)" />
                                                                                </q-btn>
                                                                            </div>
                                                                        </template>
                                                                        <q-card>
                                                                            <q-card-section>
                                                                                <div class="row q-col-gutter-md">
                                                                                    <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                                                        <div>の場合</div>
                                                                                        <q-select 
                                                                                            dense 
                                                                                            outlined 
                                                                                            v-model="frc.fconSymbol" 
                                                                                            :options="conditionSymbols"
                                                                                            lazy-rules
                                                                                            :rules="[
                                                                                                val => val != null || 'フィールドは必須項目です', 
                                                                                            ]"
                                                                                        />
                                                                                    </div>
                                                                                    <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                                                        <div>状態</div>
                                                                                        <q-input 
                                                                                            type="number"
                                                                                            dense 
                                                                                            outlined 
                                                                                            v-model="frc.fconSituation" 
                                                                                            lazy-rules
                                                                                            :rules="[
                                                                                                val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です'
                                                                                            ]"
                                                                                        />
                                                                                    </div>
                                                                                    <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                                                                        <div>結果</div>
                                                                                        <q-input 
                                                                                            type="number"
                                                                                            dense 
                                                                                            outlined 
                                                                                            v-model="frc.fconResult" 
                                                                                            lazy-rules
                                                                                            :rules="[
                                                                                                val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です'
                                                                                            ]"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                </q-card-section>
                                                                            </q-card>
                                                                        </q-expansion-item>
                                                                </q-list>
                                                            </div>
                                                            <q-btn @click="addMoreFormulaResultCondition(f.fcondition)" flat size="md" color="primary" icon="mdi-plus" label="数式の結果に条件を追加する" />
                                                        </div>
                                                    </div>
                                                    </q-card-section>
                                                </q-card>
                                            </q-expansion-item>
                                    </q-list>
                                </div>
                                <div class="col-12 q-mt-sm">
                                    <q-btn @click="addMoreFormula" flat size="md" color="primary" icon="mdi-plus" label="数式を追加" />
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
                                    <q-input  
                                        outlined 
                                        class="common-input-text" 
                                        v-model="formData.totalFormula"
                                        dense
                                    />
                                    <span class="text-caption text-grey">( F1+F2 )</span>
                                </div>
                            </div>
                            <div class="row q-mt-md">
                                <div class="col-12">
                                    <label>基本額<small class="required-suffix">※必須</small></label>
                                </div>
                                <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 q-mt-sm q-mt-sm">
                                    <q-input 
                                        type="number" 
                                        outlined 
                                        class="common-input-text" 
                                        v-model="formData.baseAmount"
                                        lazy-rules
                                        dense
                                        :rules="[
                                            val => val != 0 && val != '' && !!val.replace(/\s/g, '') || 'フィールドは必須項目です', 
                                        ]"
                                    />
                                </div>
                            </div>
                            <div class="row q-mt-md">
                                <div class="col-12">
                                    <label>ウェブサイト名</label>
                                </div>
                                <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 q-mt-sm">
                                    <q-select  
                                        outlined 
                                        v-model="formData.qParent"
                                        :options="parentSelect"
                                        lazy-rules
                                        dense
                                    />
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

  .q-field--auto-height .q-field__control, .q-field--auto-height .q-field__native {
    min-height: 40px !important;
  }
}

.form-select {
  margin-bottom: 20px;
}

</style>