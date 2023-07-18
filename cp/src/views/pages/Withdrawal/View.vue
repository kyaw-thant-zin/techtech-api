<script setup>
import dayjs from 'dayjs'
import { APP } from '@/config.js'
import { useQuasar } from 'quasar'
import { ref, watchEffect, computed } from 'vue'
import { useWithdrawalStore } from '@/stores/withdrawal'

const $q = useQuasar()
const wStore = useWithdrawalStore()
const id = computed(() => APP.decryptID(wStore.router.currentRoute._value.params.id.toString()))
wStore.handleGetWithdrawal(id.value)

const withdrawal = ref(null)

watchEffect(() => {
    // set area rows
    if (wStore._withdrawal !== null && wStore._withdrawal?.id) {
        withdrawal.value = wStore._withdrawal
    } else {
        withdrawal.value = null
    }

}, [wStore._withdrawal])

// confirm withdrawal

function showConfirmDialog() {
    $q.dialog({
      title: `この要求を確認してもよろしいですか?`,
      message: 'この契約者はまもなくログインできなくなります。 間違いがあった場合は「請負業者」で契約者を再起動できます。',
      cancel: true,
      persistent: true,
      html: true,
    }).onOk( async () => {
        await wStore.confirm(id.value)
        if(wStore._success) {
            $q.notify({
                caption: '出金要求が正常に確認されました',
                message: '成功！',
                type: 'positive',
                timeout: 1000
            })
            await wStore.handleGetWithdrawal(id.value)
            wStore.storeSuccess(false)
        }

        if(wStore._error) {
            $q.notify({
                caption: 'エラーが発生しました。後でもう一度お試しください。',
                message: 'エラー！',
                type: 'negative',
                timeout: 1000
            })
            wStore.storeError(false)
        }
    })
}

</script>
<template>
    <div class="full-width  q-mb-xl">
        <div class="q-pa-sm row items-start q-gutter-md">
            <q-breadcrumbs>
                <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
                <q-breadcrumbs-el label="請負業者" />
            </q-breadcrumbs>
        </div>
        <div class="full-width row wrap justify-start items-start content-start">
            <div class="q-px-md row">
                <q-toolbar>
                    <q-toolbar-title class="page-ttl">
                        請負業者の詳細
                    </q-toolbar-title>
                </q-toolbar>
            </div>
            <div class="full-width row q-px-md q-mt-md">
                <div class="col-12">
                    <q-card class="common-card">
                        <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
                            <div class="common-card-ttl"></div>
                        </q-card-section>
                        <q-card-section class="">
                            <div class="row justify-end q-col-gutter-sm">
                                <div class="col-auto" v-if="withdrawal != null && withdrawal.user_id != null">
                                    <q-btn class="shadow-3 p-common-btn" icon="mdi-card-account-details-outline" label="" :to="{ name: 'cp.contractor.detail', params: { id: APP.encryptID(withdrawal.user_id) }}" no-caps />
                                </div>
                                <div class="col-auto" v-if="withdrawal?.status">
                                    <q-btn color="positive" class="shadow-3" size="md" icon="mdi-check" label="" @click="showConfirmDialog()" />
                                </div>
                            </div>
                            <div class="row q-col-gutter-md q-mt-lg">
                                <div class="col-12 col-sm-6 col-md-6 col-lg-6"  v-if="withdrawal != null">
                                    <q-markup-table class="no-shadow">
                                        <tbody>
                                            <tr>
                                                <td class="text-left">地位</td>
                                                <td class="text-right">
                                                    <template v-if="withdrawal.status == 0">
                                                        <q-chip size="sm" icon="mdi-check-circle-outline" color="positive"
                                                            text-color="white">まだ</q-chip>
                                                    </template>
                                                    <template v-if="withdrawal.status == 1">
                                                        <q-chip size="sm" icon="mdi-alert-circle-outline" color="negative"
                                                            text-color="white">確認済み</q-chip>
                                                    </template>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-left">お支払方法</td>
                                                <td class="text-right">{{ withdrawal.company_name }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-left">お支払方法</td>
                                                <td class="text-right">{{ withdrawal.email }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-left">お支払方法</td>
                                                <td class="text-right">{{ withdrawal.month_to_withdrawl }}</td>
                                            </tr>
                                            <tr v-if="withdrawal?.leaving_reason != null">
                                                <td class="text-left">お支払方法</td>
                                                <td class="text-right">{{ withdrawal.leaving_reason.name }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-left">依頼日</td>
                                                <td class="text-right">{{ dayjs(withdrawal.created_at).format('YYYY/MM/DD HH: mm') }}</td>
                                            </tr>
                                        </tbody>
                                    </q-markup-table>
                                </div>
                                <template v-if="withdrawal?.other_withdrawals &&  withdrawal.other_withdrawals.length > 0">
                                    <div class="col-12 col-sm-6 col-md-6 col-lg-6" v-for="wd in withdrawal.other_withdrawals">
                                        <q-markup-table class="no-shadow">
                                            <tbody>
                                                <tr>
                                                    <td class="text-left">地位</td>
                                                    <td class="text-right">
                                                        <template v-if="wd.status == 0">
                                                            <q-chip size="sm" icon="mdi-check-circle-outline" color="positive"
                                                                text-color="white" class="text-weight-medium">まだ</q-chip>
                                                        </template>
                                                        <template v-if="wd.status == 1">
                                                            <q-chip size="sm" icon="mdi-alert-circle-outline" color="negative"
                                                                text-color="white" class="text-weight-medium">確認済み</q-chip>
                                                        </template>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">お支払方法</td>
                                                    <td class="text-right">{{ wd.company_name }}</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">お支払方法</td>
                                                    <td class="text-right">{{ wd.email }}</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">お支払方法</td>
                                                    <td class="text-right">{{ wd.month_to_withdrawl }}</td>
                                                </tr>
                                                <tr v-if="withdrawal?.leaving_reason != null">
                                                    <td class="text-left">お支払方法</td>
                                                    <td class="text-right">{{ wd.leaving_reason.name }}</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">依頼日</td>
                                                    <td class="text-right">{{ dayjs(wd.created_at).format('YYYY/MM/DD HH: mm') }}</td>
                                                </tr>
                                            </tbody>
                                        </q-markup-table>
                                    </div>
                                </template>
                                
                            </div>
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
}</style>