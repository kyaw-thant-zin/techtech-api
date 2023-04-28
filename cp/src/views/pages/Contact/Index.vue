<script setup>
  import { ref } from 'vue'

  const columns = [
    { name: 'direction', align: 'center', label: '', field: 'direction' },
    { name: 'status', align: 'center', label: '', field: 'status' },
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

  const rows = [
    {
      direction: 1,
      status: true,
      company: 'Areoline',
      name: 'Frozen Yogurt',
      email: 'example@gmail.com',
      tel: '000-000-0000',
      action: 4.0,
    },
    {
      status: false,
      company: 'Microsoft',
      name: 'Ice cream sandwich',
      email: 'example@gmail.com',
      tel: '000-000-0000',
      action: 4.0,
    },
    {
      status: false,
      company: 'Apple',
      name: 'Eclair',
      email: 'example@gmail.com',
      tel: '000-000-0000',
      action: 6.0,
    },
    {
      status: true,
      company: 'Alibaba',
      name: 'Cupcake',
      email: 'example@gmail.com',
      tel: '000-000-0000',
      action: 4.3,
    },
    {
      status: true,
      company: 'Space X',
      name: 'Gingerbread',
      email: 'example@gmail.com',
      tel: '000-000-0000',
      action: 3.9,
    },
    {
      status: 0,
      name: 'Jelly bean',
      email: 'example@gmail.com',
      total: '80,0000円(税込)',
      summry: 94,
      action: 0.0,
    },
    {
      status: 2,
      name: 'Lollipop',
      email: 'example@gmail.com',
      total: '80,0000円(税込)',
      summry: 98,
      action: 0,
    },
    {
      status: 2,
      name: 'Honeycomb',
      email: 'example@gmail.com',
      total: '80,0000円(税込)',
      summry: 87,
      action: 6.5,
    },
    {
      status: 2,
      name: 'Donut',
      email: 'example@gmail.com',
      total: '80,0000円(税込)',
      summry: 51,
      action: 4.9,
    },
    {
      status: 2,
      name: 'KitKat',
      email: 'example@gmail.com',
      total: '80,0000円(税込)',
      summry: 65,
      action: 7,
    }
  ]

  const selected = ref([])


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
                :rows="rows"
                :columns="columns"
                row-key="name"
                selection="multiple"
                v-model:selected="selected"
              >
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
                      <q-badge class="tb-contact-new-badge" color="red" floating>NEW</q-badge>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-status="props">
                  <q-td>
                    <div class="row justify-center items-center">
                      <div>
                        <q-checkbox
                          class="tb-gold-checkbox"
                          v-model="props.row.status"
                          checked-icon="mdi-star"
                          unchecked-icon="mdi-star-outline"
                          indeterminate-icon="help"
                        />
                      </div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td>
                    <div class="row no-wrap justify-center items-center q-gutter-sm">
                      <div>
                        <q-btn size="sm" padding="sm" round class="p-common-bg" icon="mdi-eye-outline"/>
                      </div>
                      <div>
                        <q-btn size="sm" padding="sm" round class="p-common-btn" icon="mdi-trash-can-outline" />
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