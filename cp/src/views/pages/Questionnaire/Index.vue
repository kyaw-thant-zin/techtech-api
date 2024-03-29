<script setup>

import { useQuasar } from 'quasar'
import { APP } from '@/config.js'
import { ref, watchEffect } from 'vue' 
import { useQuestionnaireStore } from '@/stores/Questionnaire'
import { useSettingStore } from '@/stores/setting'
import { onBeforeRouteLeave } from 'vue-router'

const $q = useQuasar()
const qStore = useQuestionnaireStore()
const settingStore = useSettingStore()
qStore.reset()
qStore.handleGetQuestionnaires()

const filter = ref('')
const rows = ref([])
const columns = [
    { name: 'index', required: false, label: 'INDEX', sortable: false },
    { name: 'id', required: false, label: 'ID', sortable: false },
    { name: 'qindex', field: 'qindex', align: 'center', required: true, label: '質問番号', sortable: true },
    {
        name: 'question',
        required: true,
        label: '質問',
        align: 'left',
        sortable: true,
        field: 'question',
    },
    { name: 'ans_intput_type', align: 'center', label: '入力方式', field: 'ans_intput_type', sortable: true },
    { name: 'action', align: 'center', label: 'アクション', field: 'action' },
]
const visibileColumns = ['qindex', 'question', 'ans_intput_type', 'action']
const pagination = ref({
  page: qStore._questionnaireTablePage,
    rowsPerPage: 1
  })
  
  watchEffect(() => {
    pagination.value.rowsPerPage = settingStore._itemPerPage
  }, [settingStore._itemPerPage])

const changePagination = (newPagination) => {
  const pageNumber = newPagination.page
  pagination.value.page = pageNumber
  qStore.storeTablePagiPage(pageNumber)
}

onBeforeRouteLeave((to, from, next) => {
  if(!to.name.includes(from.name)) {
    qStore.storeTablePagiPage(1)
  }
  next()
})

watchEffect(() => {
  // set q rows
  if(qStore._questionnaires !== null) {
    rows.value = qStore._questionnaires
  }

}, [qStore._questionnaires])

function showConfirmDialog(row) {
    $q.dialog({
      title: `消去してもよろしいですか「${row.question}」?`,
      message: 'このアンケートは近々削除されます。 この操作を元に戻すことはできません。',
      cancel: true,
      persistent: true,
      html: true,
    }).onOk( async () => {
        await qStore.handleDestroyQuestionnaire(row.id)
        if(qStore._success) {
            qStore.handleGetQuestionnaires()
            $q.notify({
                caption: 'アンケートは正常に削除されました。',
                message: '成功！',
                type: 'positive',
                timeout: 1000
            })
            qStore.storeSuccess(false)
        }

        if(qStore._error) {
            $q.notify({
                caption: 'エラーが発生しました。後でもう一度お試しください。',
                message: 'エラー！',
                type: 'negative',
                timeout: 1000
            })
            qStore.storeError(false)
        }
    })
}


</script>
<template>
    <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
          <q-breadcrumbs-el label="アンケート" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            アンケート
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
              <div class="common-card-ttl">アンケート一覧</div>
              <q-btn class="shadow-3 p-common-btn" label="新規作成" :to="{ name: 'cp.questionnaire.create' }" no-caps />
            </q-card-section>
            <q-card-section class="q-px-none">
              <q-table
                class="index-table no-shadow"
                :filter="filter"
                :rows="rows"
                :columns="columns"
                row-key="id"
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
                      <q-td key="qindex" :props="props"><div class="text-weight-medium color-orange">{{ props.row.qindex }}</div></q-td>
                      <q-td key="question" :props="props">{{ props.row.question }}</q-td>
                      <q-td key="ans_intput_type" :props="props">{{ props.row.ans_intput_type }}</q-td>
                      <q-td key="action" :props="props">
                        <div class="row no-wrap justify-center items-center q-gutter-sm">
                          <div>
                            <router-link :to="{ name: 'cp.questionnaire.detail', params: { id: APP.encryptID(props.row.id) } }">
                              <q-btn size="sm" padding="sm" round class="p-common-bg" icon="mdi-note-edit-outline"/>
                            </router-link>
                          </div>
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
<style lang="scss">

</style>