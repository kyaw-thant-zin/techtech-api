<script setup>
  
  import { APP } from '@/config.js'
  import { useQuasar } from 'quasar'
  import { ref, watchEffect } from 'vue'
  import { useContactStore } from '@/stores/contact'
  import { onBeforeRouteLeave } from 'vue-router'

  const $q = useQuasar()
  const contactStore = useContactStore()
  contactStore.handleGetContacts()

  const filter = ref('')
  const columns = [
    { name: 'id', required: false, label: 'ID', sortable: false },
    { name: 'new', required: false, label: 'NEW', sortable: false },
    { name: 'direction', align: 'center', label: '', field: 'direction' },
    {
      name: 'company',
      required: true,
      label: '会社名',
      align: 'center',
      field: row => row.company,
      format: val => `${val}`,
      sortable: true
    },
    { name: 'name', align: 'center', label: '氏名', field: 'name', sortable: true },
    { name: 'email', align: 'center', label: 'メールアドレス', field: 'email', sortable: true },
    { name: 'tel', align: 'center', label: '電話番号', field: 'tel', sortable: true },
    { name: 'action', align: 'center', label: 'アクション', field: 'action' },
  ]
  const visibileColumns = ['direction', 'company', 'name', 'email', 'tel', 'action']
  const rows = ref([])
  const pagination = ref({
    page: contactStore._contactTablePage,
    rowsPerPage: 10
  })

  const changePagination = (newPagination) => {
    const pageNumber = newPagination.page
    pagination.value.page = pageNumber
    contactStore.storeTablePagiPage(pageNumber)
  }

  onBeforeRouteLeave((to, from, next) => {
    if(!to.name.includes(from.name)) {
      contactStore.storeTablePagiPage(1)
    }
    next()
  })

  watchEffect(() => {
    // set contacts rows
    if(contactStore._contacts !== null) {
      rows.value = contactStore._contacts
    }

  }, [contactStore._contacts])

  function showConfirmDialog(row) {
    $q.dialog({
      title: `この連絡先を削除してもよろしいですか?`,
      message: 'この連絡先はすぐに削除されます。 この操作は元に戻すことができません。',
      cancel: true,
      persistent: true,
      html: true,
    }).onOk( async () => {
        await contactStore.handleDestroyContact(row.id)
        if(contactStore._success) {
          contactStore.handleGetContacts()
            $q.notify({
                caption: '正常に削除されました。',
                message: '成功！',
                type: 'positive',
                timeout: 1000
            })
            contactStore.storeSuccess(false)
        }

        if(contactStore._error) {
            $q.notify({
                caption: 'エラーが発生しました。後でもう一度お試しください。',
                message: 'エラー！',
                type: 'negative',
                timeout: 1000
            })
            contactStore.storeError(false)
        }
    })
  }


</script>
<template>
    <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
          <q-breadcrumbs-el label="コンタクト" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            コンタクト
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
              <div class="common-card-ttl">コンタクト一覧</div>
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
                @update:pagination="changePagination"
              >
                <template v-slot:top-right>
                  <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
                <template v-slot:body-cell-direction="props">
                  <q-td>
                    <div class="row justify-center items-center">
                      <div v-if="props.row.direction == 1">
                        <q-icon size="sm" color="positive" name="mdi-message-arrow-right" />
                      </div>
                      <div v-else>
                        <q-icon size="sm" color="info" name="mdi-message-arrow-left" />
                      </div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-company="props">
                  <q-td>
                    <div class="tb-mail-subject">
                      {{ props.row.company }}
                      <q-badge v-if="props.row.new" class="tb-contact-new-badge" color="red" floating>NEW</q-badge>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td>
                    <div class="row no-wrap justify-center items-center q-gutter-sm">
                      <div>
                        <router-link :to="{ name: 'cp.contact.detail', params: { id: APP.encryptID(props.row.id) } }">
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