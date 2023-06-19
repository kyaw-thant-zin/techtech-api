<script setup>
import { useQuasar } from 'quasar'
import { ref, watchEffect, watch } from 'vue' 

const $q = useQuasar()



const parentSelect = ref([
    {label: 'なし', value: 0},
    {label: 'Yes', value: 1}
])

const formData = ref({
    'qName': '',
    'qParent': parentSelect.value[0]
})

// create new questionnaire
const onSubmit = async () => {
    
}

// watch the loading
// watchEffect(() => {
//     // set area rows
//     if(qStore._loading) {
//         $q.loading.show()
//     } else {
//         $q.loading.hide()
//     }

// }, [qStore._loading])

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
                    enctype='multipart/form-data'
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
                                        :rules="[
                                            val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です', 
                                        ]"
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