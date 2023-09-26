<script setup>
import { useQuasar } from 'quasar'
import { ref, watchEffect } from 'vue'

const $q = useQuasar()
const mode = ref('現在メンテナンス モードはオフです。')
const btnMode = ref('メンテナンスを有効にする')

const toggleMaintenance = () => {
    console.log('toggle')
}

</script>
<template>
    <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'cp.dashboard' }" />
          <q-breadcrumbs-el label="メンテナンス設定" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            メンテナンス設定
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card q-pb-xl">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
            </q-card-section>
            <q-card-section class="q-px-none">
                <div class="row  justify-center">
                    <div class="col-auto">
                        <h6 class="text-center">{{ mode }}</h6>
                    </div>
                    <div class="col-12"></div>
                    <div class="col-auto">
                        <q-btn @click="toggleMaintenance" size="md" class="shadow-3 p-common-btn" :label="btnMode" no-caps />
                    </div>
                </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>