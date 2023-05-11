<script setup>
import { useQuasar } from 'quasar'
import { ref, watchEffect } from 'vue' 
import { usePMStore } from '@/stores/pm'

const $q = useQuasar()
const pmStore = usePMStore()

const settingForm = ref(null)
const formData = ref({
    code: '',
    name: ''
})

const resetForm = () => {
    formData.value.code = ''
    formData.value.name = ''
}

// watch the loading
watchEffect(() => {
    // set area rows
    if(pmStore._loading) {
        $q.loading.show()
    } else {
        $q.loading.hide()
    }

}, [pmStore._loading])

// create new area
const onSubmit = async () => {
    await pmStore.handleStorePM(formData.value)
    if(pmStore._success) {
        $q.notify({
            caption: 'エリアが正常に追加されました',
            message: '成功！',
            type: 'positive',
            timeout: 1000
        })
        pmStore.storeSuccess(false)
        resetForm()
        pmStore.router.replace({ name: 'cp.area' })
    }

    if(pmStore._error) {
        $q.notify({
            caption: 'エラーが発生しました。後でもう一度お試しください。',
            message: 'エラー！',
            type: 'negative',
            timeout: 1000
        })
        pmStore.storeError(false)
    }
}

</script>
<template>
    <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
          <q-breadcrumbs-el label="お支払方法" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            お支払方法
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
              ref="settingForm"
              @submit="onSubmit"
              class="q-gutter-md"
            >
              <div class="row q-px-lg q-mt-none">
                <div class="col-6">
                  <div class="row items-top">
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                      <label class="">コード</label>
                    </div>
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                      <q-input 
                        name="code" 
                        outlined 
                        class="common-input-text"  
                        v-model="formData.code"
                        lazy-rules
                        :rules="[
                          val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です', 
                        ]"
                      />
                    </div>
                  </div>
                  <div class="row items-top q-mt-md">
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                      <label class="">お支払方法</label>
                    </div>
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input form-select">
                        <q-input 
                            name="name" 
                            outlined 
                            class="common-input-text" 
                            v-model="formData.name"
                            lazy-rules
                            :rules="[
                            val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です', 
                            ]"
                        />
                    </div>
                  </div>
                  <div class="row items-top">
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                    </div>
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
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