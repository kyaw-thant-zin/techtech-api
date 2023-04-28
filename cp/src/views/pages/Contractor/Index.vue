<script setup>
  import { ref } from 'vue'

  const columns = [
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
    { name: 'workdone', align: 'center', label: '完成した作品', field: 'workdone', sortable: true },
    { name: 'action', align: 'center', label: 'アクション', field: 'action' },
  ]

  const rows = [
    {
      status: 1,
      name: 'Frozen Yogurt',
      email: 'example@gmail.com',
      company: 'Areoline',
      area: '北海道, 青森県',
      work: 'Clean drains, Clean guttering',
      workdone: 3,
      action: 4.0,
    },
    {
      status: 0,
      name: 'Ice cream sandwich',
      email: 'example@gmail.com',
      company: 'Apple',
      area: '岩手県, 宮城',
      work: 'Treat the grass, Painting',
      workdone: 5,
      action: 4.0,
    },
    {
      status: 1,
      name: 'Eclair',
      email: 'example@gmail.com',
      company: 'Microsoft',
      area: '岩手県, 宮城',
      work: 'Repair Windows',
      workdone: 15,
      action: 4.0,
    },
    {
      status: 1,
      name: 'Cupcake',
      email: 'example@gmail.com',
      company: 'Microsoft',
      area: '岩手県, 宮城',
      work: 'Repair Windows',
      workdone: 15,
      action: 4.0,
    },
    {
      status: 0,
      name: 'Gingerbread',
      email: 'example@gmail.com',
      company: 'Microsoft',
      area: '岩手県, 宮城',
      work: 'Repair Windows',
      workdone: 15,
      action: 4.0,
    },
    {
      status: 0,
      name: 'Jelly bean',
      email: 'example@gmail.com',
      company: 'Microsoft',
      area: '岩手県, 宮城',
      work: 'Repair Windows',
      workdone: 15,
      action: 4.0,
    },
    {
      status: 1,
      name: 'Lollipop',
      email: 'example@gmail.com',
      company: 'Microsoft',
      area: '岩手県, 宮城',
      work: 'Repair Windows',
      workdone: 15,
      action: 4.0,
    },
    {
      status: 1,
      name: 'Honeycomb',
      email: 'example@gmail.com',
      total: '80,0000円(税込)',
      summry: 87,
      action: 6.5,
    },
    {
      status: 1,
      name: 'Donut',
      email: 'example@gmail.com',
      total: '80,0000円(税込)',
      summry: 51,
      action: 4.9,
    },
    {
      status: 1,
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
                :rows="rows"
                :columns="columns"
                row-key="name"
                selection="multiple"
                v-model:selected="selected"
              >
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
                        <q-btn size="sm" padding="sm" round color="info" icon="mdi-eye-outline"/>
                      </div>
                      <div>
                        <q-btn size="sm" padding="sm" round color="negative" icon="mdi-trash-can-outline" />
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