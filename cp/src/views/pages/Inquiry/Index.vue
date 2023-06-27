<script setup>
import { useQuasar } from 'quasar'
import { APP } from '@/config.js'
import { ref, watchEffect } from 'vue' 
import { useInquiryStore } from '@/stores/Inquiry'

const $q = useQuasar()
const iQStore = useInquiryStore()
iQStore.handleGetInquiries()

const filter = ref('')
const columns = [
  { name: 'id', required: false, label: 'ID', sortable: false },
  { name: 'status', align: 'center', label: '地位', field: 'status', sortable: true },
  {
    name: 'name',
    required: true,
    label: '氏名',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'email', align: 'left', label: 'メールアドレス', field: 'email', sortable: true },
  { name: 'summry', align: 'center', label: '摘要', field: 'summry', sortable: true },
  { name: 'total', align: 'center', label: '合計', field: 'total', sortable: true },
  { name: 'action', align: 'center', label: 'アクション', field: 'action' },
]
const visibileColumns = ['status', 'name', 'email', 'summry', 'total', 'action']
const rows = ref([])
const pagination = {
  page: 1,
  rowsPerPage: 10
}

watchEffect(() => {
  // set q rows
  if(iQStore._inquiries !== null) {
    rows.value = iQStore._inquiries
  }

}, [iQStore._inquiries])

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
            問い合わせ
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
              <div class="common-card-ttl">お問い合わせ一覧</div>
            </q-card-section>
            <q-card-section class="q-px-none">
              <q-table
                class="index-table no-shadow"
                :filter="filter"
                :rows="rows"
                :columns="columns"
                row-key="name"
                :visible-columns="visibileColumns"
                :pagination="pagination"
              >
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
                      <div v-if="props.row.status == 3">
                        <q-chip size="sm" icon="mdi-close-circle-outline" color="accent" text-color="white">合格した</q-chip>
                      </div>
                      <div v-if="props.row.status == 2">
                        <q-chip size="sm" icon="mdi-check-circle-outline" color="positive" text-color="white">確認済み</q-chip>
                      </div>
                      <div v-if="props.row.status == 1">
                        <q-chip size="sm" icon="mdi-progress-clock" color="warning">近すぎる</q-chip>
                      </div>
                      <div v-if="props.row.status == 0">
                        <q-chip size="sm" icon="mdi-account-search-outline" color="negative"  text-color="white">まだ</q-chip>
                      </div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td>
                    <div class="row no-wrap justify-center items-center q-gutter-sm">
                          <div>
                            <router-link :to="{ name: 'cp.questionnaire.detail', params: { id: APP.encryptID(props.row.id) } }">
                              <q-btn size="sm" padding="sm" round class="p-common-bg" icon="mdi-eye-outline"/>
                            </router-link>
                          </div>
                          <div>
                            <q-btn @click="showConfirmDialog(props.row)" size="sm" padding="sm" round class="p-common-btn" icon="mdi-trash-can-outline" />
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

<style lang="scss">

  .index-table {
    th {
      text-align: center;
      font-weight: 800 !important;
    }
    th, td {
      vertical-align: middle;
    }

    td {
      overflow: hidden;
      max-width: 150px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .q-chip__content {
      font-weight: 600;
    }

    .tb-mail-subject {
      position: relative;
      display: inline-block;
    }

    .tb-contact-new-badge {
      font-size: 8px;
      font-weight: 600;
      transform: translateX(100%);
      right: -5px;
    }

    .tb-gold-checkbox {
      i {
        color: #FFD700;
      }
    }
  }


</style>