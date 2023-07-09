<script setup>
import { useQuasar } from 'quasar'
import { ref, watchEffect } from 'vue'
import { usePMStore } from '@/stores/pm'
import { onBeforeRouteLeave } from 'vue-router'

import { useSettingStore } from '@/stores/setting'
const settingStore = useSettingStore()

const $q = useQuasar()
const pmStore = usePMStore()
pmStore.handlePMs()

const filter = ref('')
const columns = [
    { name: 'id', required: false, label: 'ID', sortable: false },
    {
        name: 'code',
        required: true,
        label: 'コード',
        align: 'center',
        field: row => row.code,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'name', align: 'center', label: 'お支払方法', field: 'name', sortable: true },
    { name: 'action', align: 'center', label: 'アクション', field: 'action' },
]
const visibileColumns = ['code', 'name', 'action']
const rows = ref([])
const pagination = ref({
  page: pmStore._pmTablePage,
    rowsPerPage: 1
  })
  
  watchEffect(() => {
    pagination.value.rowsPerPage = settingStore._itemPerPage
  }, [settingStore._itemPerPage])

const changePagination = (newPagination) => {
  const pageNumber = newPagination.page
  pagination.value.page = pageNumber
  pmStore.storeTablePagiPage(pageNumber)
}

onBeforeRouteLeave((to, from, next) => {
  if(!to.name.includes(from.name)) {
    pmStore.storeTablePagiPage(1)
  }
  next()
})

function showConfirmDialog(row) {
    $q.dialog({
      title: `消去してもよろしいですか「${row.name}」?`,
      message: 'このエリアはすぐに削除されます。 この操作を元に戻すことはできません。',
      cancel: true,
      persistent: true,
      html: true,
    }).onOk( async () => {
        await pmStore.handleDestroyPM(row.id)
        if(pmStore._success) {
            pmStore.handlePMs()
            $q.notify({
                caption: 'エリアは正常に削除されました。',
                message: '成功！',
                type: 'positive',
                timeout: 1000
            })
            pmStore.storeSuccess(false)
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
    })
}

watchEffect(() => {
  // set area rows
  if(pmStore._pms !== null) {
    rows.value = pmStore._pms
  }

}, [pmStore._pms])

const error = ref(false)
const errorMessage = ref('')

const requiredValidation = (val) => {
    if(val == '') {
        error.value = true
        errorMessage.value = 'フィールドは必須項目です'
        return false
    } else {
        // remove error message
        error.value = false
        errorMessage.value = ''
        return true
    }

}

const updateAreaRow = async (r) => {
    if(r.row.name != '' && r.row.code != '') {
        // remove error message
        error.value = false
        errorMessage.value = ''

        // update row
        await pmStore.handelUpdatePM( r.row.id, r.row)
        if(pmStore._success) {
            pmStore.handlePMs()
            $q.notify({
                caption: 'エリアが正常に更新されました。',
                message: '成功！',
                type: 'positive',
                timeout: 1000
            })
            pmStore.storeSuccess(false)
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
        return true
    }
}


</script>
<template>
    <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'cp.dashboard' }" />
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
              <div class="common-card-ttl">お支払方法一覧</div>
              <q-btn class="shadow-3 p-common-btn" label="新規作成" :to="{ name: 'cp.pm.create' }" no-caps />
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
                        <q-td key="code" :props="props">
                            {{ props.row.code }}
                            <q-popup-edit 
                                buttons
                                label-set="Save"
                                label-cancel="Close"
                                v-model="props.row.code" 
                                :validate="requiredValidation"
                                @hide="updateAreaRow(props)"
                                v-slot="scope"
                            >
                                <q-input 
                                    type="text"
                                    v-model="scope.value" 
                                    dense 
                                    autofocus 
                                    :error="error"
                                    :error-message="errorMessage"
                                />
                            </q-popup-edit>
                        </q-td>
                        <q-td key="name" :props="props">
                            <div class="text-center">
                            {{ props.row.name }}
                            </div>
                            <q-popup-edit 
                                buttons
                                label-set="Save"
                                label-cancel="Close"
                                v-model="props.row.name" 
                                :validate="requiredValidation"
                                @hide="updateAreaRow(props)"
                                v-slot="scope"
                            >
                                <q-input 
                                    type="text"
                                    v-model="scope.value" 
                                    dense 
                                    autofocus 
                                    :error="error"
                                    :error-message="errorMessage"
                                />
                            </q-popup-edit>
                        </q-td>
                        <q-td key="action" :props="props">
                            <div class="row no-wrap justify-center items-center q-gutter-sm">
                            <div>
                                <q-btn @click="showConfirmDialog(props.row)" size="sm" padding="sm" round class="p-common-btn" icon="mdi-trash-can-outline" />
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