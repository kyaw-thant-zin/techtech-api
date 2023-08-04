<script setup>
import { useQuasar } from 'quasar'
  import { APP } from '@/config.js'
import { ref, watchEffect } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useUnitPriceStore } from '@/stores/unit-price'

import { useSettingStore } from '@/stores/setting'
const settingStore = useSettingStore()


const $q = useQuasar()
const uPriceStore = useUnitPriceStore()

const init = async () => {

  await uPriceStore.handleGetUnitPrices('index', '')
  rows.value = uPriceStore._unitPrices

}

init()

const filter = ref('')
const columns = [
    { name: 'id', required: false, label: 'ID', sortable: false },
    {
        name: 'name',
        required: true,
        label: 'コード',
        align: 'center',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'action', align: 'center', label: 'アクション', field: 'action' },
]
const visibileColumns = ['name', 'action']
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
  if(!to.name.includes(from.name)) {
    uPriceStore.storeTablePagiPage(1)
  }
  next()
})



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
              <div class="common-card-ttl">単価一覧</div>
            </q-card-section>
            <q-card-section class="q-px-none">
              <q-table
                class="index-table no-shadow"
                :filter="filter"
                :rows="rows"
                :columns="columns"
                row-key="code"
                :visible-columns="visibileColumns"
                :pagination="pagination"
                @update:pagination="changePagination"
              >
                <template v-slot:top-right>
                  <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="name" :props="props">
                            <div class="text-center">
                            {{ props.row.name }}
                            </div>
                        </q-td>
                        <q-td key="action" :props="props">
                            <div class="row no-wrap justify-center items-center q-gutter-sm">
                            <div>
                              <router-link :to="{ name: 'cp.unitprice.detail', params: { id: APP.encryptID(props.row.id) } }">
                                <q-btn size="sm" padding="sm" round class="p-common-bg" icon="mdi-note-edit-outline"/>
                              </router-link>
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