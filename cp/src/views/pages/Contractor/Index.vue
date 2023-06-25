<script setup>
  import { useQuasar } from 'quasar'
  import { APP } from '@/config.js'
  import { ref, watchEffect } from 'vue'
  import { useContractorStore } from '@/stores/contractor'

  const $q = useQuasar()
  const contractorStore = useContractorStore()
  contractorStore.handleContractors()

  const filter = ref('')
  const columns = [
    { name: 'id', required: false, label: 'ID', sortable: false },
    { name: 'status', align: 'center', label: '地位', field: 'status' },
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
    { name: 'company', align: 'center', label: '会社', field: 'company', sortable: true },
    { name: 'area', align: 'center', label: 'エリア', field: 'area', sortable: true },
    { name: 'work', align: 'center', label: '仕事', field: 'work', sortable: true },
    { name: 'action', align: 'center', label: 'アクション', field: 'action' },
  ]
  const visibileColumns = ['status', 'name', 'email', 'company', 'area', 'work', 'workdone', 'action']
  const rows = ref([])
  const pagination = {
    page: 1,
    rowsPerPage: 10
  }

  watchEffect(() => {
    // set area rows
    if(contractorStore._contractors !== null) {
      rows.value = contractorStore._contractors
    }

  }, [contractorStore._contractors])

  function showConfirmDialog(row) {
    $q.dialog({
      title: `「${row.name} のステータスを変更してもよろしいですか?`,
      message: 'このアクションはユーザー側にも影響し、ユーザーはログインできなくなります。',
      cancel: true,
      persistent: true,
      html: true,
    }).onOk( async () => {
        await contractorStore.handleDeactivateContractor(row.id)
        if(contractorStore._success) {
          contractorStore.handleContractors()
            $q.notify({
                caption: 'ステータスが正常に変更されました',
                message: '成功！',
                type: 'positive',
                timeout: 1000
            })
            contractorStore.storeSuccess(false)
        }

        if(contractorStore._error) {
            $q.notify({
                caption: 'エラーが発生しました。後でもう一度お試しください。',
                message: 'エラー！',
                type: 'negative',
                timeout: 1000
            })
            contractorStore.storeError(false)
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
            請負業者
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
              <div class="common-card-ttl">請負業者一覧</div>
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
                      <div v-if="props.row.status == 1">
                        <q-chip size="sm" icon="mdi-check-circle-outline" color="positive" text-color="white">アクティブ</q-chip>
                      </div>
                      <div v-if="props.row.status == 0">
                        <q-chip size="sm" icon="mdi-lock-outline" color="negative"  text-color="white">非活性</q-chip>
                      </div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td>
                    <div class="row no-wrap justify-center items-center q-gutter-sm">
                      <div>
                        <router-link :to="{ name: 'cp.contractor.detail', params: { id: APP.encryptID(props.row.id) } }">
                          <q-btn size="sm" padding="sm" round class="p-common-bg" icon="mdi-eye-outline"/>
                        </router-link>
                      </div>
                      <div>
                        <template v-if="props.row.status == 1">
                          <q-btn @click="showConfirmDialog(props.row)" size="sm" padding="sm" round class="p-common-btn" icon="mdi-lock-open-variant-outline" />
                        </template>
                        <template v-else>
                          <q-btn @click="showConfirmDialog(props.row)" size="sm" padding="sm" round class="p-common-btn" icon="mdi-lock-outline" />
                        </template>
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