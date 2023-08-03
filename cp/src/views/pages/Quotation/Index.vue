<script setup>
  import { useQuasar } from 'quasar'
  import { APP } from '@/config.js'
  import { ref, watch, watchEffect } from 'vue' 
  import { useQuotationStore } from '@/stores/quotation'
  import { onBeforeRouteLeave } from 'vue-router'

  import { useSettingStore } from '@/stores/setting'
  const settingStore = useSettingStore()

  const $q = useQuasar()
  const quoteStore = useQuotationStore()
  quoteStore.reset()
  quoteStore.handleGetQuotations()

  const fixedModal = ref(false)
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

  const pagination = ref({
    page: quoteStore._quotationTablePage,
    rowsPerPage: 1
  })
  
  watchEffect(() => {
    pagination.value.rowsPerPage = settingStore._itemPerPage
  }, [settingStore._itemPerPage])

  const changePagination = (newPagination) => {
    const pageNumber = newPagination.page
    pagination.value.page = pageNumber
    quoteStore.storeTablePagiPage(pageNumber)
  }

  onBeforeRouteLeave((to, from, next) => {
    if(!to.name.includes(from.name)) {
      quoteStore.storeTablePagiPage(1)
    }
    next()
  })

  watchEffect(() => {
    // set quotation rows
    if(quoteStore._quotations !== null) {
      rows.value = quoteStore._quotations
    }

  }, [quoteStore._quotations])

  const quotat = ref({})

  const showDetailDialog = async (id) => {
    await quoteStore.handleGetQuotation(APP.decryptID(id.toString()))
    if(quoteStore._quotation != null) {
      const quote = quoteStore._quotation
      quotat.value.q_name = quote.q_name
      quotat.value.condition_string = quote.condition
      quotat.value.formula_total = quote.formula_total
      quotat.value.base_amount = quote.base_amount

      if(quote?.quotation_conditions_with_all != null) {
        const groupedConditions = {};
        for (const item of quote.quotation_conditions_with_all) {
          const conditionId = item.condition_id;
          if (!groupedConditions.hasOwnProperty(conditionId)) {
            groupedConditions[conditionId] = [];
          }
          groupedConditions[conditionId].push(item);
        }

        quotat.value.condition = groupedConditions
      }

      if(quote?.quotation_formulas_with_all != null) {
        const groupedFormula = {};
        for (const item of quote.quotation_formulas_with_all) {
          const conditionId = item.formula_total_id;
          if (!groupedFormula.hasOwnProperty(conditionId)) {
            groupedFormula[conditionId] = [];
          }
          groupedFormula[conditionId].push(item);
        }
        quotat.value.formula = groupedFormula
      }
      fixedModal.value = true
    }
  }

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
                    <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                    <q-td key="base_amount" :props="props">{{ props.row.base_amount }}</q-td>
                    <q-td key="created" :props="props">{{ props.row.created }}</q-td>
                    <q-td key="action" :props="props">
                      <div class="row no-wrap justify-center items-center q-gutter-sm">
                        <div>
                          <q-btn size="sm" padding="sm" round class="p-common-btn" color="info" icon="mdi-eye-outline" @click="showDetailDialog(APP.encryptID(props.row.id))" />
                        </div>
                        <div>
                          <router-link :to="{ name: 'cp.quotation.detail', params: { id: APP.encryptID(props.row.id) } }">
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

  <!-- Modal -->
  <q-dialog v-model="fixedModal">
      <q-card style="min-width: 350px;">
        <q-card-section class="row items-center">
          <div class="text-subtitle1">{{ quotat.q_name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <template v-if="quotat?.condition && Object.keys(quotat.condition).length > 0">
            <div>お見積りの条件</div>
            <q-list>
              <q-item class="q-my-sm" v-for="(qC, key, index) in quotat.condition">
                <q-item-section avatar>
                  <q-avatar size="sm" color="primary" text-color="white">{{ key }}</q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <template v-for="qCc in qC">
                      {{ 'Q'+qCc.qq.qindex }}, 
                    </template>
                  </q-item-label>
                  <q-item-label caption>{{ qC[0].math_symbol.jp_name }} ( {{ qC[0].math_symbol.sign }} )</q-item-label>
                  <q-item-label >
                    <template v-if="qC[0].qa != null">
                      {{ qC[0].qa.label }}
                    </template>
                    <template v-else-if="qC[0].qa_any == 1">
                      {{ 'どれでも' }}
                    </template>
                    <template v-else-if="qC[0].qa_value != null">
                      {{ qC[0].qa_value }}
                    </template>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-separator/>
          </template>

          <template v-if="quotat.condition_string != null">
            <div class="q-mt-md">確認すべき条件</div>
            <q-list>
              <q-item class="q-my-sm">
                <q-item-section avatar>
                  <q-avatar size="sm" color="primary" text-color="white">C</q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ quotat.condition_string }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-separator/>
          </template>

          <template v-if="quotat?.formula && Object.keys(quotat.formula).length > 0" >
            <div class="q-mt-md">見積り式</div>
            <q-list v-if="quotat?.formula && Object.keys(quotat.formula).length > 0">
              <q-item class="q-my-sm" v-for="(qF, key, index) in quotat.formula">
                <q-item-section avatar>
                  <q-avatar size="sm" color="primary" text-color="white">{{ key }}</q-avatar>
                </q-item-section>

                <q-item-section>
                  <template v-for="qFf in qF">
                    <q-item-label>
                        {{ qFf.formula }}
                    </q-item-label>
                    <template v-if="qFf.quotation_formula_conditions.length > 0">
                      <q-item-label caption>計算式結果の条件</q-item-label>
                      <template v-for="qfc in qFf.quotation_formula_conditions">
                        <q-item-label caption>{{ qfc.math_symbol.jp_name }}({{ qfc.math_symbol.sign }}) {{ qfc.situation }} = {{ qfc.result }}</q-item-label>
                      </template>
                    </template>
                  </template>
                </q-item-section>
              </q-item>
            </q-list>
            <q-separator />
          </template>

          <template v-if="quotat.formula_total != null">
            <div class="q-mt-md">合計の計算式</div>
            <q-list>
              <q-item class="q-my-sm">
                <q-item-section>
                  <q-item-label>{{ quotat.formula_total }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-separator />
          </template>

          <template  v-if="quotat.base_amount != null">
            <div class="q-mt-md">基本額</div>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>{{ quotat.base_amount }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </template>
          
        </q-card-section>

        <q-separator />
      </q-card>
    </q-dialog>
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