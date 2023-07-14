<script setup>
import { APP } from '@/config.js'
import { ref, watchEffect } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useWithdrawalStore } from '@/stores/withdrawal'

import { useSettingStore } from '@/stores/setting'
const settingStore = useSettingStore()

const withdrawalStore = useWithdrawalStore()
withdrawalStore.handleGetAllWithDrawals()

const filter = ref('')
const columns = [
  { name: 'id', required: false, label: 'ID', sortable: false, field: 'id' },
  { name: 'status', align: 'center', label: '地位', field: 'status' },
  { name: 'requested_date', align: 'center', label: '依頼日', field: 'requested_date', sortable: true },
  {
    name: 'company',
    required: true,
    label: '会社',
    align: 'left',
    field: row => row.company,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'email', align: 'left', label: 'メールアドレス', field: 'email', sortable: true },
  { name: 'workdone', align: 'center', label: '問い合わせ合計', field: 'workdone', sortable: true },
  { name: 'action', align: 'center', label: 'アクション', field: 'action' },
]
const visibileColumns = ['status', 'requested_date', 'company', 'email', 'workdone', 'action']
const rows = ref([])
const pagination = ref({
  page: withdrawalStore._withdrawalTablePage,
  rowsPerPage: 1
})

watchEffect(() => {
  pagination.value.rowsPerPage = settingStore._itemPerPage
}, [settingStore._itemPerPage])

const changePagination = (newPagination) => {
  const pageNumber = newPagination.page
  pagination.value.page = pageNumber
  withdrawalStore.storeTablePagiPage(pageNumber)
}

onBeforeRouteLeave((to, from, next) => {
  if (!to.name.includes(from.name)) {
    withdrawalStore.storeTablePagiPage(1)
  }
  next()
})

// watch withdrawals
watchEffect(() => {
  if (withdrawalStore._withdrawals.length > 0) {
    rows.value = withdrawalStore._withdrawals
  }

}, [withdrawalStore._withdrawals])


</script>
<template>
  <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
        <q-breadcrumbs-el label="退会" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            退会
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
              <div class="common-card-ttl">退会一覧</div>
            </q-card-section>
            <q-card-section class="q-px-none">
              <q-table class="index-table no-shadow" :filter="filter" :rows="rows" :columns="columns" row-key="code"
                :visible-columns="visibileColumns" :pagination="pagination" @update:pagination="changePagination">
                <template v-slot:top-right>
                  <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
                <template v-slot:body-cell-status="props">
                  <q-td>
                    <div class="row justify-center">
                      <div v-if="props.row.status == 0">
                        <q-chip class="q-px-lg" size="sm" icon="mdi-check-circle-outline" color="positive"
                          text-color="white">確認済み<q-badge v-if="props.row.duplicated_count > 1" color="red" floating align="top">{{ props.row.duplicated_count }}</q-badge></q-chip>
                      </div>
                      <div v-if="props.row.status == 1">
                        <q-chip class="q-px-lg" size="sm" icon="mdi-alert-circle-outline" color="warning" text-color="white">まだ<q-badge  v-if="props.row.duplicated_count > 1" color="red" floating align="top">{{ props.row.duplicated_count }}</q-badge></q-chip>
                      </div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td>
                    <div class="row no-wrap justify-center items-center q-gutter-sm">
                      <div>
                        <router-link :to="{ name: 'cp.withdrawal.detail', params: { id: APP.encryptID(props.row.id) } }">
                          <q-btn size="sm" padding="sm" round class="p-common-bg" icon="mdi-eye-outline" />
                        </router-link>
                      </div>
                    </div>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>