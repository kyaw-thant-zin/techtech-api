<script setup>
import { useQuasar } from 'quasar'
import { ref, watchEffect, watch } from 'vue' 
import { useQuestionnaireStore } from '@/stores/Questionnaire'

const $q = useQuasar()
const qStore = useQuestionnaireStore()
const optionsInputs = [
    'テキスト', // text
    '選択', // select
    '選択肢' // checkbox or radio
]
const optionsText = [
    '自由入力',
    '対策'
]
const optionMeasures = [
    'm',
    '坪'
]
const optionsChoice = [
    '独身', // single
    '多数' // multiple
]

const textItems = ref({
    'suffix': '',
    'quantity': 1,
    'unit_price': 0
})
const choiceItems = ref([])
const qaudSelectItems = ref({
    'use_default': false,
    'quantity': 1,
    'unit_price': 0
})
const selectItems = ref([])
const addMoreSelectItem = () => {
    selectItems.value.push({
        label: null,
        amount: null,
    })
}
const addMoreChoiceItem = () => {
    choiceItems.value.push({
        label: null,
        file: null,
        amount: null
    })
}
const handleRemoveSelectOption = (si) => {
    const index = selectItems.value.indexOf(si)
    if (index !== -1) {
        selectItems.value.splice(index, 1);
    }
}
const handleRemoveChoiceOption = (ci) => {
    const index = choiceItems.value.indexOf(ci)
    if (index !== -1) {
        choiceItems.value.splice(index, 1);
    }
}
const handleRemoveChoiceItemImage = (ci) => {
  if(ci.file && ci.file != null) {
    ci.file = null
  }
}

const formData = ref({
    question: '',
    suffix: '',
    inputType: '',
    choice: '独身',
    textItems: textItems.value, // テキスト
    selectItems: selectItems.value, // 選択
    choiceItems: choiceItems.value // 選択肢
})

const resetForm = () => {
    formData.value.question = ''
    formData.value.inputType = ''
    formData.value.text_label = ''
    selectItems.value.label = ''
    selectItems.value.amount = ''
    choiceItems.value.label = ''
    choiceItems.value.amount = ''
    choiceItems.value.file = null
}

// create new questionnaire
const onSubmit = async () => {
    // check the input type and remove others
    if(formData.value.inputType == 'テキスト') {
        // text
        delete formData.value.choiceItems
        delete formData.value.selectItems
        delete formData.value.choice
    } else if(formData.value.inputType == '選択') {
        // select
        delete formData.value.textItems
        delete formData.value.choiceItems
        delete formData.value.choice
    } else {
        // choice
        if(formData.value.choice == '独身') {
            // ラジオボタン - radio
            formData.value.inputType = 'ラジオボタン'
        } else {
            // チェックボックス - checkbox
            formData.value.inputType = 'チェックボックス'
        }

        delete formData.value.textItems
        delete formData.value.selectItems
        
    }

    // send API
    await qStore.handleStoreQuestionnaire(formData.value)

    // check result
    if(qStore._success) {
        $q.notify({
            caption: 'アンケートが正常に追加されました',
            message: '成功！',
            type: 'positive',
            timeout: 1000
        })
        qStore.storeSuccess(false)
        resetForm()
        qStore.router.replace({ name: 'cp.questionnaire' })
    }

    if(qStore._error) {
        $q.notify({
            caption: 'エラーが発生しました。後でもう一度お試しください。',
            message: 'エラー！',
            type: 'negative',
            timeout: 1000
        })
        qStore.storeError(false)
    }
}

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const srcUrl = event.target.result
      resolve(srcUrl);
    };
    reader.onerror = (event) => {
      reject(event.target.error)
    };
    reader.readAsDataURL(file)
  })
}

watch(
  () => choiceItems.value,
  async () => {
    if(choiceItems.value.length > 0) {
      for (let index = 0; index < choiceItems.value.length; index++) {
        if(choiceItems.value[index].file != null) {
          const src = await getBase64(choiceItems.value[index].file)
          choiceItems.value[index].localSrc = src
        } 
      }
    }
  },
  { deep: true }
)

// watch the loading
watchEffect(() => {
    // set area rows
    if(qStore._loading) {
        $q.loading.show()
    } else {
        $q.loading.hide()
    }

}, [qStore._loading])

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
            アンケート作成
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
                    enctype='multipart/form-data'
                >
                    <div class="row q-px-lg q-mt-none">
                        <div class="col-12">
                        <div class="row ">
                            <div class="col-12 col-sm-12 col-md-2 col-lg-1 col-xl-1">
                                <label class="">質問</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-10 col-lg-11 col-xl-11 form-input">
                                <q-input 
                                    name="question" 
                                    outlined 
                                    class="common-input-text"  
                                    v-model="formData.question"
                                    lazy-rules
                                    :rules="[
                                    val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です', 
                                    ]"
                                />
                                <div class="row q-mt-sm">
                                    <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4 form-input">
                                        <label class="">接尾辞</label>
                                        <q-input 
                                            name="question" 
                                            outlined 
                                            class="common-input-text"  
                                            v-model="formData.suffix"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row  q-mt-xl">
                            <div class="col-12 col-sm-12 col-md-2 col-lg-1 col-xl-1">
                            <label class="">回答</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-10 col-lg-11 col-xl-11">
                                <div class="row">
                                    <div class="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">
                                        <div>
                                            <div class="text-caption q-mb-xs">入力方式</div>
                                            <q-select 
                                                dense 
                                                outlined 
                                                v-model="formData.inputType" 
                                                :options="optionsInputs" 
                                                lazy-rules
                                                :rules="[
                                                    val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です', 
                                                ]"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <!-- テキスト input text -->
                                <div class="row q-mt-sm q-col-gutter-md" v-if="formData.inputType == 'テキスト'">
                                    <div class="col-12 col-sm-4 col-md-2 col-lg-1 col-xl-1">
                                        <div>
                                            <div class="text-caption q-mb-xs">接尾辞</div>
                                            <q-input 
                                                dense 
                                                outlined 
                                                v-model="textItems.suffix" 
                                            />
                                        </div>
                                    </div>
                                    <div class="col-6 col-sm-4 col-md-2 col-lg-1 col-xl-1">
                                        <div>
                                            <div class="text-caption q-mb-xs">接尾語</div>
                                            <q-input 
                                                type="number"
                                                dense 
                                                outlined 
                                                v-model="textItems.quantity" 
                                                input-class="text-right"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-6 col-sm-4 col-md-2 col-lg-1 col-xl-1">
                                        <div>
                                            <div class="text-caption q-mb-xs">決済金額</div>
                                            <q-input 
                                                dense 
                                                outlined 
                                                type="number"
                                                v-model="textItems.unit_price" 
                                                suffix="円"
                                                input-class="text-right"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <p class="q-mb-xs text-caption"><span class="text-negative">※</span> 「接尾語」と「決済金額」に値がない場合、入力はフリータイプになります。</p>
                                        <p class="q-mb-xs text-caption"><span class="text-negative">※</span> 「接尾語」と「決済金額」に値がある場合、入力タイプは「数値」になります。</p>
                                        <p class="q-mb-xs text-caption">
                                            <span class="text-negative">※</span> 2 ( 接尾語 ) × 1000 ( 決済金額 ) = 1000 ( 金額 ) <br />
                                            <span class="text-negative">※</span> ( 決済金額 × 希望数量 )  / 接尾語 = 金額
                                        </p>
                                    </div>
                                </div>
                                <!-- 選択 input select -->
                                <div  class="row q-mt-lg" v-if="formData.inputType == '選択'">
                                    <div class="col-12 q-mb-sm">
                                        <q-checkbox dense size="sm" v-model="qaudSelectItems.use_default" label="すべての選択にデフォルトの「数量」と「単価」を使用します。" />
                                    </div>
                                    <div class="col-12 q-mb-sm q-mt-sm" v-if="qaudSelectItems.use_default">
                                        <div class="row q-col-gutter-md">
                                            <div class="col-6 col-sm-4 col-md-2 col-lg-1 col-xl-1">
                                                <div>
                                                    <div class="text-caption q-mb-xs">接尾語</div>
                                                    <q-input 
                                                        type="number"
                                                        dense 
                                                        outlined 
                                                        v-model="textItems.quantity" 
                                                        input-class="text-right"
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-6 col-sm-4 col-md-2 col-lg-1 col-xl-1">
                                                <div>
                                                    <div class="text-caption q-mb-xs">決済金額</div>
                                                    <q-input 
                                                        dense 
                                                        outlined 
                                                        type="number"
                                                        v-model="textItems.unit_price" 
                                                        suffix="円"
                                                        input-class="text-right"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 q-mb-sm q-mt-md" v-for="(si, index) in selectItems" :key="index">
                                        <q-list bordered class="rounded-borders">
                                            <q-expansion-item
                                                dense
                                                dense-toggle
                                                switch-toggle-side
                                                expand-icon-toggle
                                            >
                                                <template v-slot:header>
                                                    <div class="q-item__section column q-item__section--main justify-center">
                                                        <div class="q-item__label">オプション</div><!---->
                                                    </div>
                                                    <div class="q-item__section column q-item__section--side justify-center">
                                                        <q-btn dense size="sm" flat>
                                                            <q-icon color="negative" name="mdi-trash-can-outline" @click="handleRemoveSelectOption(si)" />
                                                        </q-btn>
                                                    </div>
                                                    
                                                </template>
                                                <q-card>
                                                    <q-card-section>
                                                        <div>
                                                            <div>ラベル</div>
                                                            <q-input 
                                                                dense 
                                                                outlined 
                                                                v-model="si.label" 
                                                            />
                                                        </div>
                                                        <div class="q-mt-sm">
                                                            <div>接尾語</div>
                                                            <q-input 
                                                                type="number"
                                                                dense 
                                                                outlined 
                                                                v-model="si.amount" 
                                                            />
                                                        </div>
                                                        <div class="q-mt-sm">
                                                            <div>決済金額</div>
                                                            <template  v-if="!qaudSelectItems.use_default">
                                                                <q-input 
                                                                    type="number"
                                                                    dense 
                                                                    outlined 
                                                                    v-model="si.amount" 
                                                                    suffix="円"
                                                                />
                                                            </template>
                                                            <template v-else>
                                                                <p>0 <span>円</span></p>
                                                            </template>
                                                        </div>
                                                    </q-card-section>
                                                </q-card>
                                            </q-expansion-item>
                                        </q-list>
                                    </div>
                                    <div class="col-12 q-mt-sm">
                                        <q-btn @click="addMoreSelectItem" flat size="md" color="primary" icon="mdi-plus" label="回答を追加" />
                                    </div>
                                </div>
                                <!-- 選択肢 radio or checkbox -->
                                <div class="row q-mt-sm" v-if="formData.inputType == '選択肢'">
                                    <div class="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">
                                        <div>
                                            <div class="text-caption q-mb-xs">タイプ</div>
                                            <q-select 
                                                dense 
                                                outlined 
                                                v-model="formData.choice" 
                                                :options="optionsChoice" 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div  class="row q-mt-lg" v-if="formData.inputType == '選択肢'">
                                    <div class="col-12 q-mb-sm" v-for="(ci, index) in choiceItems" :key="index">
                                        <q-list bordered class="rounded-borders">
                                            <q-expansion-item
                                                dense
                                                dense-toggle
                                                switch-toggle-side
                                                expand-icon-toggle
                                            >
                                                <template v-slot:header>
                                                    <div class="q-item__section column q-item__section--main justify-center">
                                                        <div class="q-item__label">選択肢の選択</div><!---->
                                                    </div>
                                                    <div class="q-item__section column q-item__section--side justify-center">
                                                        <q-btn dense size="sm" flat>
                                                            <q-icon color="negative" name="mdi-trash-can-outline" @click="handleRemoveChoiceOption(ci)" />
                                                        </q-btn>
                                                    </div>
                                                    
                                                </template>
                                                <q-card>
                                                    <q-card-section>
                                                        <div>
                                                            <div>ラベル</div>
                                                            <q-input 
                                                                dense 
                                                                outlined 
                                                                v-model="ci.label" 
                                                            />
                                                        </div>
                                                        <div class="q-mt-sm">
                                                            <div>画像</div>
                                                            <q-file
                                                                v-model="ci.file"
                                                                label="画像を選択"
                                                                outlined
                                                                dense
                                                                accept=".jpg,.png, image/*"
                                                            >
                                                                <template v-slot:prepend>
                                                                    <q-icon name="attach_file" />
                                                                </template>
                                                            </q-file>
                                                            <div class="q-mt-sm" v-if="ci.file">
                                                              <q-img
                                                                :src="ci.localSrc"
                                                                loading="lazy"
                                                                spinner-color="white"
                                                                style="max-width: 250px; height: 140px;"
                                                                fit="contain"
                                                              >
                                                                <q-btn @click="handleRemoveChoiceItemImage(ci)" class="absolute-top-right all-pointer-events" size="xs" round color="negative" icon="mdi-close" />
                                                              </q-img>
                                                              
                                                            </div>
                                                        </div>
                                                        <div class="q-mt-sm">
                                                            <div>決済金額</div>
                                                            <q-input 
                                                                type="number"
                                                                dense 
                                                                outlined 
                                                                v-model="ci.amount" 
                                                                suffix="円"
                                                            />
                                                        </div>
                                                    </q-card-section>
                                                </q-card>
                                            </q-expansion-item>
                                        </q-list>
                                    </div>
                                    <div class="col-12 q-mt-sm">
                                        <q-btn @click="addMoreChoiceItem" flat size="md" color="primary" icon="mdi-plus" label="回答を追加" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row ">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input q-mt-xl">
                            <q-btn type="submit" class="p-common-btn" label="新規作成" />
                            </div>
                        </div>
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