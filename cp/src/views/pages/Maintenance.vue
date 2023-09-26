<script setup>
import { useQuasar } from 'quasar'
import { ref, onMounted, watchEffect } from 'vue'
import { useMaintenanceStore } from '@/stores/Maintenance'

const $q = useQuasar()
const maintenanceStore = useMaintenanceStore()

const onTxt = '現在メンテナンス中です。'
const offTxt = '現在メンテナンス モードはオフです。'
const activateTxt = 'メンテナンスを有効にする'
const cancelTxt = 'メンテナンスの中止'
const changeOffTxt = '現在メンテナンス モードはオフです。'
const changeOnTxt = '現在メンテナンスモードがオンになっています。'

const modeTxt = ref('現在メンテナンス モードはオフです。')
const btnMode = ref('メンテナンスを有効にする')
const noteTxt = ref('')


const formData = ref({
    'maintenance': false
})

const maintenanceOn = () => {
    modeTxt.value = onTxt
    btnMode.value = cancelTxt
    noteTxt.value = changeOnTxt
}

const maintenanceOff = () => {
    modeTxt.value = offTxt
    btnMode.value = activateTxt
    noteTxt.value = changeOffTxt
}

const getMaintenance = async () => {
    const mode = await maintenanceStore.handleMaintenance(1)
    if(mode != null && mode) {
        maintenanceOn()
    } else if(mode != null) {
        maintenanceOff()
    }
}

onMounted( async () => {

    await getMaintenance()

})

const toggleMaintenance = async () => {

    maintenanceStore.storeLoading(true)

    formData.value.maintenance = !formData.value.maintenance

    await maintenanceStore.handelUpdateMaintenance(1, formData.value)
    await getMaintenance()
    maintenanceStore.storeLoading(false)

    if(maintenanceStore._success) {
        $q.notify({
            caption: noteTxt.value,
            message: '成功！',
            type: 'positive',
            timeout: 1000
        })
        maintenanceStore.storeSuccess(false)
    }

    if(maintenanceStore._error) {
        $q.notify({
            caption: 'エラーが発生しました。後でもう一度お試しください。',
            message: 'エラー！',
            type: 'negative',
            timeout: 1000
        })
        maintenanceStore.storeError(false)
    }

}

// watch the loading
watchEffect(() => {
    // set area rows
    if(maintenanceStore._loading) {
        $q.loading.show()
    } else {
        $q.loading.hide()
    }

}, [maintenanceStore._loading])

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
                        <template v-if="formData.maintenance">
                            <q-icon size="xl" color="positive" name="mdi-check-circle-outline" />
                        </template>
                        <template v-else>
                            <q-icon size="xl" color="negative" name="mdi-close-circle-outline" />
                        </template>
                    </div>
                    <div class="col-12"></div>
                    <div class="col-auto">
                        <h6 class="text-center q-mt-sm">
                            {{ modeTxt }}
                        </h6>
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