<script setup>
import { ref } from 'vue'

const columns = [
    {
        name: 'code',
        required: true,
        label: 'コード',
        align: 'center',
        field: row => row.code,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'name', align: 'center', label: '対応可能な施工', field: 'name', sortable: true },
    { name: 'action', align: 'center', label: 'アクション', field: 'action' },
]

const rows = [
  {
    code: '01',
    name: 'Wall Painting',
    action: '',
  },
]

const selected = ref([])


</script>
<template>
    <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
          <q-breadcrumbs-el label="対応可能な施工" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            対応可能な施工
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
              <div class="common-card-ttl">対応可能な施工一覧</div>
              <q-btn class="shadow-3" color="primary" label="新規作成" to="/" no-caps />
            </q-card-section>
            <q-card-section class="q-px-none">
              <q-table
                class="index-table no-shadow"
                :rows="rows"
                :columns="columns"
                row-key="name"
                v-model:selected="selected"
              >
                <template v-slot:body-cell-name="props">
                  <q-td>
                    <div class="text-center">
                      {{ props.row.name }}
                    </div>
                    <q-popup-edit v-model="props.row.name" v-slot="scope">
                      <q-input v-model="props.row.name" dense autofocus counter @keyup.enter="scope.set" />
                    </q-popup-edit>
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td>
                    <div class="row no-wrap justify-center items-center q-gutter-sm">
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