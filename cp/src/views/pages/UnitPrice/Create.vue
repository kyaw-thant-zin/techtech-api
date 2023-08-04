<script setup>
import { useQuasar } from 'quasar'
import { APP } from '@/config.js'
import { ref, watchEffect, computed } from 'vue'
import { useUnitPriceStore } from '@/stores/unit-price'
import { useAreaStore } from '@/stores/area'


const areaStore = useAreaStore()

const $q = useQuasar()
const uPriceStore = useUnitPriceStore()
const id = computed(() => APP.decryptID(uPriceStore.router.currentRoute._value.params.id.toString()))

const prefectures = ref([])

const init = async () => {
    await areaStore.handleAreas()
    if(areaStore._areas.length > 0) {
        const transformedArray = areaStore._areas.map(item => {
            return {
                label: item.name+'県',
                value: item.id
            };
        })
        prefectures.value = transformedArray
    }
}

init()

const settingForm = ref(null)
const formData = ref({
    'up_id': id.value,
    'large_classification': '',
    'minor_classification': '',
    'content': '',
    'specification': '',
    'prefecture': '',
    'amount': '',
})

const resetForm = () => {
    formData.value.code = ''
    formData.value.name = ''
}

// watch the loading
watchEffect(() => {
    // set area rows
    if (uPriceStore._loading) {
        $q.loading.show()
    } else {
        $q.loading.hide()
    }

}, [uPriceStore._loading])

// create new area
const onSubmit = async () => {

    await uPriceStore.handleStoreUnitPrice(formData.value)
    
    if (uPriceStore._success) {
        $q.notify({
            caption: '単価が正常に追加されました',
            message: '成功！',
            type: 'positive',
            timeout: 1000
        })
        uPriceStore.storeSuccess(false)
        resetForm()
        uPriceStore.router.replace({ name: 'cp.unitprice.detail', params: { id: APP.encryptID(id.value) } })
    }

    if (uPriceStore._error) {
        $q.notify({
            caption: 'エラーが発生しました。後でもう一度お試しください。',
            message: 'エラー！',
            type: 'negative',
            timeout: 1000
        })
        uPriceStore.storeError(false)
    }
}

</script>
<template>
    <div class="full-width  q-mb-xl">
        <div class="q-pa-sm row items-start q-gutter-md">
            <q-breadcrumbs>
                <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
                <q-breadcrumbs-el label="単価" />
            </q-breadcrumbs>
        </div>
        <div class="full-width row wrap justify-start items-start content-start">
            <div class="q-px-md row">
                <q-toolbar>
                    <q-toolbar-title class="page-ttl">
                        単価
                    </q-toolbar-title>
                </q-toolbar>
            </div>
            <div class="full-width row q-px-md q-mt-md">
                <div class="col-12">
                    <q-card class="common-card">
                        <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
                            <q-btn class="q-px-none" icon="mdi-arrow-left" label="戻る" flat :to="{ name: 'cp.unitprice.detail', params: { id: APP.encryptID(id) } }" no-caps />
                        </q-card-section>
                        <q-card-section class="">
                            <q-form ref="settingForm" @submit="onSubmit" class="q-gutter-md">
                                <div class="row">
                                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                                        <label class="">大分類<small class="required-suffix">※必須</small></label>
                                        <q-input name="code" outlined class="common-input-text q-mt-sm"
                                            v-model="formData.large_classification" lazy-rules :rules="[
                                                val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                                            ]" />
                                    </div>
                                </div>
                                <div class="row q-mt-md">
                                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                                        <label class="">小分類</label>
                                        <q-input name="code" outlined class="common-input-text q-mt-sm"
                                            v-model="formData.minor_classification" />
                                    </div>
                                </div>
                                <div class="row q-mt-md">
                                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                                        <label class="">内容</label>
                                        <q-input name="code" outlined class="common-input-text q-mt-sm"
                                            v-model="formData.content"  />
                                    </div>
                                </div>
                                <div class="row q-mt-md">
                                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                                        <label class="">仕様</label>
                                        <q-input name="code" outlined class="common-input-text q-mt-sm"
                                            v-model="formData.specification"  />
                                    </div>
                                </div>
                                <div class="row q-mt-md">
                                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                                        <label class="">府県</label>
                                        <!-- <q-input name="code" outlined class="common-input-text q-mt-sm"
                                            v-model="formData.prefecture"  /> -->
                                        <q-select class="q-mt-sm" dense outlined v-model="formData.prefecture" :options="prefectures" />
                                    </div>
                                </div>
                                <div class="row q-mt-md">
                                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                                        <label class="">金額<small class="required-suffix">※必須</small></label>
                                        <q-input name="code" outlined class="common-input-text q-mt-sm"
                                            v-model="formData.amount" lazy-rules type="number" step="any" :rules="[
                                                val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                                            ]" />
                                    </div>
                                </div>
                                <div class="row q-mt-lg">
                                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
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