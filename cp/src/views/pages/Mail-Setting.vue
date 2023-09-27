<script setup>
import { useQuasar } from 'quasar'
import { ref, watchEffect } from 'vue'

const tab = ref('contact-mail')
const splitterModel = ref(20)

const contactMailFormData = ref({
  'subject': ''
})

</script>
<template>
  <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'cp.dashboard' }" />
        <q-breadcrumbs-el label="メール設定" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            メール設定
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class=" q-px-xl">
              <q-tabs
                v-model="tab"
                dense
                class="text-primary"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="contact-mail" label="コンタクト" />
                <q-tab name="inquiry-thankyou" label="問い合わせ" />
                <q-tab name="inquiry-contractor" label="問い合わせ (請負業者)" />
                <q-tab name="inquiry-user" label="問い合わせ (利用者)" />
                <q-tab name="register" label="登録" />
                <q-tab name="withdrawal" label="退会" />
              </q-tabs>
            </q-card-section>
            <q-separator />
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="contact-mail">
                <div class="text-subtitle1">連絡先メール設定</div>
                <div class="text-subtitle2 text-weight-light q-mb-md">お問い合わせフォームの自動返信メールの設定です。</div>
                <form class="row">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text" v-model="contactMailFormData.subject"
                      lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12 q-mt-md">
                    <label>メールデータ</label>
                    <div>
                      <q-chip outline square color="red" label="{{$name}}" />
                    </div>
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-input type="textarea" dense name="subject" outlined class="common-input-text"
                      v-model="contactMailFormData.subject" lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </form>
              </q-tab-panel>
  
              <q-tab-panel name="inquiry-thankyou">
                <div class="text-subtitle1">お問い合わせ（サンキュー）メール設定</div>
                <div class="text-subtitle2 text-weight-light q-mb-md">お問い合わせフォーム自動返信メールの設定です。 このメールはアンケート回答後に送信されます。</div>
                <form class="row">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text" v-model="contactMailFormData.subject"
                      lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-input type="textarea" dense name="subject" outlined class="common-input-text"
                      v-model="contactMailFormData.subject" lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </form>
              </q-tab-panel>
  
              <q-tab-panel name="inquiry-contractor">
                <div class="text-subtitle1">お問い合わせ（サンキュー）メール設定</div>
                <div class="text-subtitle2 text-weight-light q-mb-md">お問い合わせ自動返信メールの設定です。 このメールは、お問い合わせを受け付けた契約者宛に送信されます。
                </div>
                <form class="row">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text" v-model="contactMailFormData.subject"
                      lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-input type="textarea" dense name="subject" outlined class="common-input-text"
                      v-model="contactMailFormData.subject" lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </form>
              </q-tab-panel>
  
              <q-tab-panel name="inquiry-user">
                <div class="text-subtitle1">お問い合わせ（利用者）メール設定</div>
                <div class="text-subtitle2 text-weight-light q-mb-md">お問い合わせ自動返信メールの設定です。
                  このメールは、お問い合わせを受け付けたユーザーのメールアドレスに送信されます。</div>
                <form class="row">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text" v-model="contactMailFormData.subject"
                      lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12 q-mt-md">
                    <label>メールデータ</label>
                    <div>
                      <q-chip outline square color="red" label="{{$company_name}}" />
                      <q-chip outline square color="red" label="{{$name}}" />
                      <q-chip outline square color="red" label="{{$address01}}" />
                      <q-chip outline square color="red" label="{{$address02}}" />
                      <q-chip outline square color="red" label="{{$url}}" />
                    </div>
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-input type="textarea" dense name="subject" outlined class="common-input-text"
                      v-model="contactMailFormData.subject" lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </form>
              </q-tab-panel>
  
              <q-tab-panel name="register">
                <div class="text-subtitle1">メール設定を登録する</div>
                <div class="text-subtitle2 text-weight-light q-mb-md">このメールは登録完了後に送信されます。</div>
                <form class="row">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text" v-model="contactMailFormData.subject"
                      lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12 q-mt-md">
                    <label>メールデータ</label>
                    <div>
                      <q-chip outline square color="red" label="{{$name}}" />
                      <q-chip outline square color="red" label="{{$password}}" />
                      <q-chip outline square color="red" label="{{$plan}}" />
                      <q-chip outline square color="red" label="{{$price}}" />
                    </div>
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-input type="textarea" dense name="subject" outlined class="common-input-text"
                      v-model="contactMailFormData.subject" lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </form>
              </q-tab-panel>
  
              <q-tab-panel name="withdrawal">
                <div class="text-subtitle1">退会メール設定。</div>
                <div class="text-subtitle2 text-weight-light q-mb-md">このメールは退会完了後に送信されます。</div>
                <form class="row">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text" v-model="contactMailFormData.subject"
                      lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12 q-mt-md">
                    <label>メールデータ</label>
                    <div>
                      <q-chip outline square color="red" label="{{$name}}" />
                      <q-chip outline square color="red" label="{{$reason}}" />
                    </div>
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-input type="textarea" dense name="subject" outlined class="common-input-text"
                      v-model="contactMailFormData.subject" lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </form>
              </q-tab-panel>
            </q-tab-panels>
            
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>