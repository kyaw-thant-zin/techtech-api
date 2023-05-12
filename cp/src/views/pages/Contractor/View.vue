<script setup>
import dayjs from 'dayjs'
import { useQuasar } from 'quasar'
import { ref, watchEffect, computed } from 'vue'
import { useContractorStore } from '@/stores/contractor'

const $q = useQuasar()
const contractorStore = useContractorStore()
const id = computed(() => contractorStore.router.currentRoute._value.params.id)
contractorStore.handleContractor(id)

const user = ref(null)

watchEffect(() => {
    // set area rows
    if(contractorStore._contractor !== null) {
      user.value = contractorStore._contractor
    }

}, [contractorStore._contractor])

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
              <div class="common-card-ttl"></div>
            </q-card-section>
            <q-card-section class="">
              <div class="row">
                <div class="col-12 col-sm-12 col-md-6 col-lg-3">
                  <q-markup-table class="no-shadow"	 v-if="user != null">
                    <tbody>
                      <tr>
                        <td class="text-left">地位</td>
                        <td class="text-right">
                          <template v-if="user.status == 1">
                            <q-chip size="sm" icon="mdi-check-circle-outline" color="positive" text-color="white">アクティブ</q-chip>
                          </template>
                          <template v-if="user.status == 0">
                            <q-chip size="sm" icon="mdi-lock-outline" color="negative"  text-color="white">非活性</q-chip>
                          </template>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left">最終ログイン日</td>
                        <td class="text-right">
                          <div v-if="user.last_login_date">{{ dayjs(user.last_login_date).format('YYYY/MM/DD HH:mm') }}</div>
                          <div v-else> - </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left">お支払方法</td>
                        <td class="text-right">{{ user.payment_method.name }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">氏名</td>
                        <td class="text-right">{{ user.name }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">氏名(かな)</td>
                        <td class="text-right">{{ user.kana_name }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">メールアドレス</td>
                        <td class="text-right">{{ user.email }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">電話番号</td>
                        <td class="text-right">{{ user.tel }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">会社名</td>
                        <td class="text-right">{{ user.company_name }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">住所</td>
                        <td class="text-right">{{ user.address01 }} {{ user.address02 }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">対応可能エリア</td>
                        <td class="text-right">{{ user.areas[0].name }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">対応可能な施工</td>
                        <td class="text-right">
                          <span v-for="con in user.constructions" :key="con.id"> {{ con.name }},</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left">会社URL</td>
                        <td class="text-right">{{ user.url }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">作成日</td>
                        <td class="text-right">{{ dayjs(user.created_at).format('YYYY/MM/DD HH:mm') }}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">

.form-input {
  .q-field__control {
    height: 40px !important;
  }
  .q-field__marginal {
    height: 40px !important;
  }
  input {
    padding: 0px 5px;
    font-size: 16px;
  }

  .q-field--auto-height .q-field__control, .q-field--auto-height .q-field__native {
    min-height: 40px !important;
  }
}

.form-select {
  margin-bottom: 20px;
}

</style>