<script setup>
  import { useQuasar } from 'quasar'
  import { APP } from '@/config.js'
  import { ref, watch, watchEffect } from 'vue' 
  import { useQuotationStore } from '@/stores/quotation'

  const $q = useQuasar()
  const quoteStore = useQuotationStore()
  quoteStore.handleGetQuotations()

  const filter = ref('')
  const columns = [
    { name: 'id', required: false, label: 'ID', sortable: false },
    {
      name: 'name',
      required: true,
      label: '氏名',
      align: 'left',
      field: row => row.name,
      format: val => `${val}`,
      sortable: true
    },
    { name: 'base_amount', align: 'center', label: '基本額', field: 'base_amount' },
    { name: 'created', align: 'center', label: 'で作成された', field: 'created' },
    { name: 'action', align: 'center', label: 'アクション', field: 'action' },
  ]
  const visibileColumns = ['name', 'base_amount', 'created', 'action']
  const rows = ref([])
  const pagination = {
    page: 1,
    rowsPerPage: 10
  }

  watchEffect(() => {
    // set quotation rows
    if(quoteStore._quotations !== null) {
      rows.value = quoteStore._quotations
    }

  }, [quoteStore._quotations])

  const showConfirmDialog = (row) => {
    $q.dialog({
      title: `消去してもよろしいですか「${row.name}」?`,
      message: 'この引用はすぐに削除されます。 この操作を元に戻すことはできません。',
      cancel: true,
      persistent: true,
      html: true,
    }).onOk( async () => {
        await quoteStore.handleDestroyQuotation(row.id)
        if(quoteStore._success) {
            quoteStore.handleGetQuotations()
            $q.notify({
                caption: '見積書は正常に削除されました。',
                message: '成功！',
                type: 'positive',
                timeout: 1000
            })
            quoteStore.storeSuccess(false)
        }

        if(quoteStore._error) {
            $q.notify({
                caption: 'エラーが発生しました。後でもう一度お試しください。',
                message: 'エラー！',
                type: 'negative',
                timeout: 1000
            })
            quoteStore.storeError(false)
        }
    })
  }


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
              <div class="common-card-ttl">お見積り一覧</div>
              <q-btn class="shadow-3 p-common-btn" label="新規作成" :to="{ name: 'cp.quotation.create' }" no-caps />
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
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                    <q-td key="base_amount" :props="props">{{ props.row.base_amount }}</q-td>
                    <q-td key="created" :props="props">{{ props.row.created }}</q-td>
                    <q-td key="action" :props="props">
                      <div class="row no-wrap justify-center items-center q-gutter-sm">
                        <div>
                          <q-btn size="sm" padding="sm" round class="p-common-bg" icon="mdi-note-edit-outline"/>
                          <!-- <router-link :to="{ name: 'cp.quotation.detail', params: { id: APP.encryptID(props.row.id) } }">
                            <q-btn size="sm" padding="sm" round class="p-common-bg" icon="mdi-note-edit-outline"/>
                          </router-link> -->
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