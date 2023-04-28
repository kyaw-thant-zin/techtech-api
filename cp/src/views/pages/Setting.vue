<script setup>

import { ref } from 'vue' 

const settingForm = ref(null)
const formData = ({
  title: '',
  timeZone: '',
  email: ''
})

const timeZone = ref(null)
const timeZones = [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]

const onSubmit = () => {
  
}

</script>
<template>
    <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
          <q-breadcrumbs-el label="ユーザー" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            ユーザー
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
                      <label class="">ウェブサイト名</label>
                    </div>
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                      <q-input 
                        name="title" 
                        outlined 
                        class="common-input-text" 
                        v-model="formData.title"
                        lazy-rules
                        :rules="[
                          val => !!val.replace(/\s/g, '') || 'Field is required', 
                        ]"
                      />
                    </div>
                  </div>
                  <div class="row items-top">
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                      <label class="">時間帯</label>
                    </div>
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input form-select">
                      <q-select 
                        outlined 
                        v-model="timeZone" 
                        :options="timeZones" 
                      />
                    </div>
                  </div>
                  <div class="row items-top">
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                      <label class="">メール</label>
                    </div>
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                      <q-input 
                        name="title" 
                        outlined 
                        class="common-input-text" 
                        v-model="formData.title"
                        lazy-rules
                        :rules="[
                          val => !!val.replace(/\s/g, '') || 'Field is required', 
                        ]"
                      />
                    </div>
                  </div>
                  <div class="row items-top">
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                    </div>
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                      <q-btn color="primary" label="変更を保存" />
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