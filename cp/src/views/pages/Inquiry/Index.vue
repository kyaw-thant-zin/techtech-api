<script setup>
  import { ref } from 'vue'

  const filter = ref('')
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
    { name: 'summry', align: 'center', label: '摘要', field: 'summry', sortable: true },
    { name: 'total', align: 'center', label: '合計', field: 'total', sortable: true },
    { name: 'action', align: 'center', label: 'アクション', field: 'action' },
  ]

  const rows = [
    {
      status: 2,
      name: 'Frozen Yogurt',
      email: 'example@gmail.com',
      summry: 24,
      total: '80,0000円(税込)',
      action: 4.0,
    },
    {
      status: 0,
      name: 'Ice cream sandwich',
      email: 'example@gmail.com',
      total: '110,0000円(税込)',
      summry: 37,
      action: 4.0,
    },
    {
      status: 1,
      name: 'Eclair',
      email: 'example@gmail.com',
      total: '60,0000円(税込)',
      summry: 23,
      action: 6.0,
    },
    {
      status: 1,
      name: 'Cupcake',
      email: 'example@gmail.com',
      total: '80,0000円(税込)',
      summry: 67,
      action: 4.3,
    },
    {
      status: 0,
      name: 'Gingerbread',
      email: 'example@gmail.com',
      total: '80,0000円(税込)',
      summry: 49,
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
  const pagination = {
    page: 1,
    rowsPerPage: 10
  }

  const selected = ref([])

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
                selection="multiple"
                v-model:selected="selected"
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
                      <div v-if="props.row.status == 2">
                        <q-chip size="sm" icon="mdi-check-circle-outline" color="positive" text-color="white">終了した</q-chip>
                      </div>
                      <div v-if="props.row.status == 1">
                        <q-chip size="sm" icon="mdi-progress-clock" color="warning">進行中</q-chip>
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