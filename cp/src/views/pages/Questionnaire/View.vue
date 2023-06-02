<script setup>

import dayjs from 'dayjs'
import { APP } from '@/config.js'
import { useQuasar } from 'quasar'
import { ref, watchEffect, watch, computed } from 'vue'
import { useQuestionnaireStore } from '@/stores/Questionnaire'

const $q = useQuasar()
const qStore = useQuestionnaireStore()
const id = computed(() => APP.decryptID(qStore.router.currentRoute._value.params.id.toString()))
qStore.handleGetQuestionnaire(id)

const q = ref(null)

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
    'textType': '',
    'label': '',
    'measure': '',
    'amount': ''
})
const selectItems = ref([])
const choiceItems = ref([])

const formData = ref({
    question: '',
    prefix: '',
    inputType: '',
    // choice: '独身',
    textItems: textItems.value, // テキスト
    selectItems: selectItems.value, // 選択
    choiceItems: choiceItems.value // 選択肢
})

watchEffect(() => {
    // set area rows
    if(qStore._questionnaire !== null && qStore._questionnaire?.formData) {
      q.value = qStore._questionnaire
      // set formData
      formData.value.question = q.value.formData.question
      formData.value.prefix = q.value.formData.prefix
      formData.value.inputType = q.value.formData.inputType
      if(q.value.formData.inputType == 'テキスト') {
        // set textItems
        textItems.value.textType = q.value.textItems.textType
        if(q.value.textItems.textType == '自由入力') {
          textItems.value.label = q.value.textItems.label
        } else if(q.value.textItems.textType == '対策') {
          textItems.value.measure = q.value.textItems.measure
          textItems.value.amount = q.value.textItems.amount
        }
      } else if(q.value.formData.inputType == '選択') {
        // set selectItems
        selectItems.value = q.value.selectItems
      } else if(q.value.formData.inputType == '選択肢') {
        // set choiceItems
        choiceItems.value = q.value.choiceItems
      }
    } else {
      q.value = null 
    }

}, [qStore._questionnaire])

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
  if(ci.imagePath && ci.imagePath != null) {
    ci.imagePath = null
  } 

  if(ci.file && ci.file != null) {
    ci.file = null
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

const updateTextType = (value) => {
    if(value == '自由入力') {
        textItems.value.amount = ''
        textItems.value.measure = ''
    } else if(value == '対策') {
        textItems.value.label = ''
    }
}

// update questionnaire
const onSubmit = async () => {

  // set formData
  formData.value.textItems = textItems.value
  formData.value.selectItems = selectItems.value
  formData.value.choiceItems = choiceItems.value

  // check the input type and remove others
  if(formData.value.inputType == 'テキスト') {
    delete formData.value.choiceItems
    delete formData.value.selectItems
  } else if(formData.value.inputType == '選択') {
    delete formData.value.textItems
    delete formData.value.choiceItems
  } else {
    delete formData.value.textItems
    delete formData.value.selectItems
  }
  // send API
  await qStore.handleUpdateQuestionnaire( id, formData.value)

  // check result
  if(qStore._success) {
      $q.notify({
        caption: 'アンケートは正常に更新されました',
        message: '成功！',
        type: 'positive',
        timeout: 1000
      })
      qStore.storeSuccess(false)

      qStore.handleGetQuestionnaire(id)
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
            アンケートの詳細
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
                                        <label class="">接頭語</label>
                                        <q-input 
                                            name="question" 
                                            outlined 
                                            class="common-input-text"  
                                            v-model="formData.prefix"
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
                                <div class="row q-mt-sm q-gutter-md" v-if="formData.inputType == 'テキスト'">
                                    <div class="col-12">
                                        <div class="row">
                                            <div class="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">
                                                <div>
                                                    <div class="text-caption q-mb-xs">テキストの種類</div>
                                                    <q-select 
                                                        dense 
                                                        outlined 
                                                        v-model="textItems.textType" 
                                                        :options="optionsText" 
                                                        @update:model-value="updateTextType"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row q-mt-md"  v-if="textItems.textType == '自由入力'">
                                            <div class="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">
                                                <div>
                                                    <div class="text-caption q-mb-xs">接尾語</div>
                                                    <q-input 
                                                        dense 
                                                        outlined 
                                                        v-model="textItems.label" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row q-mt-md q-gutter-lg"  v-if="textItems.textType == '対策'">
                                            <div class="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                                                <div>
                                                    <div class="text-caption q-mb-xs">接尾語</div>
                                                    <q-select 
                                                        dense 
                                                        outlined 
                                                        v-model="textItems.measure" 
                                                        :options="optionMeasures" 
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                                                <div>
                                                    <div class="text-caption q-mb-xs">決済金額</div>
                                                    <q-input 
                                                        dense 
                                                        outlined 
                                                        type="number"
                                                        v-model="textItems.amount" 
                                                        suffix="円"
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <p> 1 (接尾語) x 決済金額</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div  class="row q-mt-lg" v-if="formData.inputType == '選択'">
                                    <div class="col-12 q-mb-sm" v-for="(si, index) in selectItems" :key="index">
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
                                                            <q-icon color="negative" name="mdi-trash-can-outline" @click="handleRemoveChoiceOption(si)" />
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
                                                            <div>決済金額</div>
                                                            <q-input 
                                                                type="number"
                                                                dense 
                                                                outlined 
                                                                v-model="si.amount" 
                                                                suffix="円"
                                                            />
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
                                <!-- <div class="row q-mt-sm" v-if="formData.inputType == '選択肢'">
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
                                </div> -->
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
                                                            <div class="q-mt-sm" v-if="ci.imagePath != null || ci.file">
                                                              <q-img
                                                                :src="ci.file != null ? ci.localSrc:ci.imagePath"
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
                            <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
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

</style>