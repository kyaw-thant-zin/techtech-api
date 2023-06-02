<script setup>
import dayjs from 'dayjs'
import { APP } from '@/config.js'
import { useQuasar } from 'quasar'
import { ref, watchEffect, computed } from 'vue'
import { useContractorStore } from '@/stores/contractor'

const $q = useQuasar()
const contractorStore = useContractorStore()
const id = computed(() => APP.decryptID(contractorStore.router.currentRoute._value.params.id.toString()))
contractorStore.handleContractor(id)

const user = ref(null)

watchEffect(() => {
    // set area rows
    if(contractorStore._contractor !== null && contractorStore._contractor?.id) {
      user.value = contractorStore._contractor
    } else {
      user.value = null 
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
            請負業者の詳細
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
                <div class="col-12 col-sm-12 col-md-6 col-lg-6">
                  <q-markup-table class="no-shadow"	 v-if="user != null">
                    <tbody>
                      <tr>
                        <th>
                          <p class="text-subtitle1">個人情報</p>
                        </th>
                      </tr>
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
                <div class="col-12 col-sm-12 col-md-6 col-lg-6">
                  <q-markup-table class="no-shadow br-left"	 v-if="user != null">
                    <tbody>
                      <tr>
                        <th>
                          <p class="text-subtitle1">お支払い詳細</p>
                        </th>
                      </tr>
                      <tr>
                        <td class="text-left">製品コード</td>
                        <td class="text-right">{{ user.payment_info.product_code }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">支払計画</td>
                        <td class="text-right">{{ user.payment_info.plan }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">決済金額</td>
                        <td class="text-right">{{ user.payment_info.price }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">カードの種類</td>
                        <td class="text-right">{{ user.cc?.cct.ccty }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">カード番号</td>
                        <td class="text-right">{{ user.cc.cn }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">有効期限</td>
                        <td class="text-right">{{ user.cc.ed_month }}月/{{ user.cc.ed_year }}年</td>
                      </tr>
                      <tr>
                        <td class="text-left">トランザクションID</td>
                        <td class="text-right">{{ user.payment_info.gid != null ? user.payment_info.gid:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">結果</td>
                        <td class="text-right">{{ user.payment_info.rst != null ? user.payment_info.rst:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">カード会社承認ID</td>
                        <td class="text-right">{{ user.payment_info.ap != null ? user.payment_info.ap:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">エラーコード</td>
                        <td class="text-right">{{ user.payment_info.ec != null ? user.payment_info.ec:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">注文ID</td>
                        <td class="text-right">{{ user.payment_info.god != null ? user.payment_info.god:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">ストア注文番号</td>
                        <td class="text-right">{{ user.payment_info.cod != null ? user.payment_info.cod:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">決済金額</td>
                        <td class="text-right">{{ user.payment_info.am != null ? user.payment_info.am:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">課税額</td>
                        <td class="text-right">{{ user.payment_info.tx != null ? user.payment_info.tx:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">送料</td>
                        <td class="text-right">{{ user.payment_info.sf != null ? user.payment_info.sf:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">合計金額</td>
                        <td class="text-right">{{ user.payment_info.ta != null ? user.payment_info.ta:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">ID発行<br/>（決済システムが発行するID）</td>
                        <td class="text-right">{{ user.payment_info.issue_id != null ? user.payment_info.issue_id:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">パスワード発行<br/>（決済システムが発行するパスワード）</td>
                        <td class="text-right">{{ user.payment_info.ps != null ? user.payment_info.ps:'-' }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">自動課金番号</td>
                        <td class="text-right">{{ user.payment_info.acid != null ? user.payment_info.acid:'-' }}</td>
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