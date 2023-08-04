<script setup>
import { useQuasar } from 'quasar'
import { APP } from '@/config.js'
import { ref, watchEffect, watch, computed } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { useUnitPriceStore } from '@/stores/unit-price'

import { useSettingStore } from '@/stores/setting'
const settingStore = useSettingStore()

const $q = useQuasar()
const uPriceStore = useUnitPriceStore()
const id = computed(() => APP.decryptID(uPriceStore.router.currentRoute._value.params.id.toString()))

const unitPrices = ref([])
const selectedUnitPrice = ref(null)


const filter = ref('')
const columns = [
    { name: 'id', required: false, label: 'ID', sortable: false },
    {
        name: 'large_classification',
        required: true,
        label: '大分類',
        align: 'center',
        field: row => row.large_classification,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'minor_classification', align: 'center', label: '小分類', field: 'minor_classification', sortable: true },
    { name: 'content', align: 'center', label: '内容', field: 'content', sortable: true },
    { name: 'specification', align: 'center', label: '仕様', field: 'specification', sortable: true },
    { name: 'prefecture', align: 'center', label: '府県', field: 'prefecture', sortable: true },
    { name: 'amount', align: 'center', label: '金額', field: 'amount', sortable: true },
    { name: 'action', align: 'center', label: 'アクション', field: 'action' },
]
const visibileColumns = ['large_classification', 'minor_classification', 'content', 'specification', 'prefecture', 'amount', 'action']
const rows = ref([])
const pagination = ref({
    page: uPriceStore._unitpriceTablePage,
    rowsPerPage: 1
})

watchEffect(() => {
    pagination.value.rowsPerPage = settingStore._itemPerPage
}, [settingStore._itemPerPage])

const changePagination = (newPagination) => {
    const pageNumber = newPagination.page
    pagination.value.page = pageNumber
    uPriceStore.storeTablePagiPage(pageNumber)
}

onBeforeRouteLeave((to, from, next) => {
    if (!to.name.includes(from.name)) {
        uPriceStore.storeTablePagiPage(1)
    }
    next()
})


const init = async (v) => {
    await uPriceStore.handleGetUnitPrices('detail', v.value)
    if (uPriceStore._unitPrices) {
        unitPrices.value = uPriceStore._unitPrices
        selectedUnitPrice.value = uPriceStore._unitPrice
    }

    if(uPriceStore._unitPriceDetails.length > 0) {
        rows.value = uPriceStore._unitPriceDetails
    }
}

init(id)


const showConfirmDialog = (row) => {
    $q.dialog({
      title: `単価を削除してもよろしいですか？`,
      message: 'この引用はすぐに削除されます。 この操作を元に戻すことはできません。',
      cancel: true,
      persistent: true,
      html: true,
    }).onOk( async () => {
        await uPriceStore.handleDestroyUnitPriceDetail(row.id)
        if(uPriceStore._success) {
            init(id)
            $q.notify({
                caption: '単価が削除されました。',
                message: '成功！',
                type: 'positive',
                timeout: 1000
            })
            uPriceStore.storeSuccess(false)
        }

        if(uPriceStore._error) {
            $q.notify({
                caption: 'エラーが発生しました。後でもう一度お試しください。',
                message: 'エラー！',
                type: 'negative',
                timeout: 1000
            })
            uPriceStore.storeError(false)
        }
    })
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
                <div class="col-12 q-mt-lg">
                    <q-card class="common-card">
                        <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
                            <div class="common-card-ttl"><span v-if="selectedUnitPrice?.label">{{ selectedUnitPrice.label }}</span>一覧</div>
                            <q-btn class="shadow-3 p-common-btn" label="新規作成" :to="{ name: 'cp.unitprice.create', params: { id: APP.encryptID(id) } }" no-caps />
                        </q-card-section>
                        <q-card-section class="q-px-none">
                            <q-table class="index-table no-shadow" :filter="filter" :rows="rows" :columns="columns"
                                row-key="code" :visible-columns="visibileColumns" :pagination="pagination"
                                @update:pagination="changePagination">
                                <template v-slot:top-right>
                                    <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                                        <template v-slot:append>
                                            <q-icon name="search" />
                                        </template>
                                    </q-input>
                                </template>
                                <template v-slot:body="props">
                                    <q-tr :props="props">
                                        <q-td key="large_classification" :props="props">
                                            <div class="text-center">
                                                {{ props.row.large_classification }}
                                            </div>
                                        </q-td>
                                        <q-td key="minor_classification" :props="props">
                                            <div class="text-center">
                                                {{ props.row.minor_classification }}
                                            </div>
                                        </q-td>
                                        <q-td key="content" :props="props">
                                            <div class="text-center">
                                                {{ props.row.content }}
                                            </div>
                                        </q-td>
                                        <q-td key="specification" :props="props">
                                            <div class="text-center">
                                                {{ props.row.specification }}
                                            </div>
                                        </q-td>
                                        <q-td key="prefecture" :props="props">
                                            <div class="text-center">
                                                {{ props.row.prefecture }}
                                            </div>
                                        </q-td>
                                        <q-td key="amount" :props="props">
                                            <div class="text-center">
                                                {{ props.row.amount }}
                                            </div>
                                        </q-td>
                                        <q-td key="action" :props="props">
                                            <div class="row no-wrap justify-center items-center q-gutter-sm">
                                                <div>
                                                    <router-link
                                                        :to="{ name: 'cp.unitprice.detail', params: { id: APP.encryptID(props.row.id) } }">
                                                        <q-btn size="xs" padding="sm" round class="p-common-bg"
                                                            icon="mdi-note-edit-outline" />
                                                    </router-link>
                                                </div>
                                                <div>
                                                    <q-btn @click="showConfirmDialog(props.row)" size="xs" padding="sm" round class="p-common-btn" icon="mdi-trash-can-outline" />
                                                  </div>
                                            </div>
                                        </q-td>
                                    </q-tr>
                                </template>
                            </q-table>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </div>
    </div>
</template>