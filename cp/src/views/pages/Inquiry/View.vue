<script setup>
import { APP } from '@/config.js'
import { useQuasar } from 'quasar'
import { ref, computed, onMounted } from 'vue'
import { useInquiryStore } from '@/stores/Inquiry'

const $q = useQuasar()
const iQStore = useInquiryStore()
const id = computed(() => APP.decryptID(iQStore.router.currentRoute._value.params.id.toString()))
const inquiry = ref(null)

onMounted( async () => {

    await iQStore.handleGetInquirie(id.value)
    const iq = iQStore._inquiriy
    if(iq) {
        inquiry.value = iq
    }

})

</script>
<template>
    <div class="full-width  q-mb-xl">
        <div class="q-pa-sm row items-start q-gutter-md">
            <q-breadcrumbs>
                <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
                <q-breadcrumbs-el label="問い合わせ" />
            </q-breadcrumbs>
        </div>
        <div class="full-width row wrap justify-start items-start content-start">
            <div class="q-px-md row">
                <q-toolbar>
                    <q-toolbar-title class="page-ttl">
                        お問い合わせ内容
                    </q-toolbar-title>
                </q-toolbar>
            </div>
            <div class="full-width row q-px-md q-mt-md">
                <div class="col-12">
                    <q-card class="common-card" v-if="inquiry != null">
                        <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
                            <div class="common-card-ttl"></div>
                        </q-card-section>
                        <q-card-section class="">
                            <q-markup-table separator="cell" flat bordered>
                                <thead>
                                    <tr>
                                        <th class="text-center bg-black text-white "><span class="text-subtitle1 text-weight-bolder">合計</span></th>
                                        <th class="text-center"><span class="text-subtitle1 text-weight-bolder">{{ inquiry.total }}</span></th>
                                    </tr>
                                </thead>
                            </q-markup-table>
                            <q-markup-table class="q-mt-md" separator="cell" flat bordered>
                                <thead>
                                    <tr>
                                        <th class="text-center  bg-black text-white "><span  class="text-subtitle2 text-weight-bolder">摘要</span></th>
                                        <th class="text-center  bg-black text-white "><span  class="text-subtitle2 text-weight-bolder">数量</span></th>
                                        <th class="text-center  bg-black text-white "><span  class="text-subtitle2 text-weight-bolder">単価</span></th>
                                        <th class="text-center  bg-black text-white "><span  class="text-subtitle2 text-weight-bolder">金額</span></th>
                                    </tr>
                                </thead>
                                <tbody v-if="inquiry.quotes.length > 0">
                                    <template v-for="iqq in inquiry.quotes">
                                        <tr>
                                            <td class="text-left"><span  class="text-subtitle2 text-weight-bolder">{{ iqq.q_name }}</span></td>
                                            <td class="text-center"><span  class="text-subtitle2 text-weight-bolder">{{ iqq.quantity }}</span></td>
                                            <td class="text-center"><span  class="text-subtitle2 text-weight-bolder">{{ iqq.unit_price }}</span></td>
                                            <td class="text-right"><span  class="text-subtitle2 text-weight-bolder">{{ iqq.amount }}</span></td>
                                        </tr>
                                    </template>
                                </tbody>
                            </q-markup-table>
                            <q-markup-table class="q-mt-md" separator="cell" flat bordered>
                                <thead>
                                    <tr>
                                        <th class="text-center  bg-black text-white "><span  class="text-subtitle2 text-weight-normal">質問</span></th>
                                        <th class="text-center  bg-black text-white "><span  class="text-subtitle2 text-weight-normal">答え</span></th>
                                    </tr>
                                </thead>
                                <tbody v-if="inquiry.qa_ans.length > 0">
                                    <template v-for="iqq in inquiry.qa_ans">
                                        <tr>
                                            <td class="text-left" style="white-space: normal;"><span  class="text-subtitle2 text-weight-normal">{{ iqq.q }}</span></td>
                                            <td class="text-center"><span  class="text-subtitle2 text-weight-normal">{{ iqq.ans }}</span></td>
                                        </tr>
                                    </template>
                                </tbody>
                            </q-markup-table>
                            <q-markup-table class="q-mt-md" separator="cell" flat bordered>
                                <tbody>
                                    <tr>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">氏名</span></td>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">{{ inquiry.name }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">氏名(カタカナ)</span></td>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">{{ inquiry.kata_name }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">住所</span></td>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">{{ inquiry.area }} ({{ inquiry.city }}) <br/> {{ inquiry.address02 }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">会社名</span></td>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">{{ inquiry.company_name }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">メールアドレス</span></td>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">{{ inquiry.email }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">電話番号</span></td>
                                        <td class="text-left"><span  class="text-subtitle2 text-weight-normal">{{ inquiry.tel }}</span></td>
                                    </tr>
                                </tbody>
                            </q-markup-table>
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