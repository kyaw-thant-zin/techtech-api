<script setup>
import { useQuasar } from 'quasar'
import { ref, onMounted, watchEffect } from 'vue'
import { useMailSettingStore } from '@/stores/mail-setting'

const $q = useQuasar()
const tab = ref('contact-mail')
const mailSettingStore = useMailSettingStore()

const contactMailFormData = ref({
  'subject': '',
  'text': ''
})

const inquiryThankYouMailFormData = ref({
  'subject': '',
  'text': ''
})

const inquiryContractorMailFormData = ref({
  'subject': '',
  'text': ''
})

const inquiryUserMailFormData = ref({
  'subject': '',
  'text': ''
})

const registerMailFormData = ref({
  'subject': '',
  'text': ''
})

const withdrawalMailFormData = ref({
  'subject': '',
  'text': ''
})

const showNoti = () => {
  if (mailSettingStore._success) {
    $q.notify({
      caption: 'メール設定が正常に更新されました',
      message: '成功！',
      type: 'positive',
      timeout: 1000
    })
    mailSettingStore.storeSuccess(false)
  }

  if (mailSettingStore._error) {
    $q.notify({
      caption: 'エラーが発生しました。後でもう一度お試しください。',
      message: 'エラー！',
      type: 'negative',
      timeout: 1000
    })
    mailSettingStore.storeError(false)
  }
}

const onSubmitContactMailSetting = async () => {
  await mailSettingStore.handelUpdateMailSetting('contact', contactMailFormData.value)
  showNoti()
}

const onSubmitInquiryThankYouMailSetting = async () => {
  await mailSettingStore.handelUpdateMailSetting('inquiry-thankyou', inquiryThankYouMailFormData.value)
  showNoti()
}

const onSubmitInquiryContractorMailSetting = async () => {
  await mailSettingStore.handelUpdateMailSetting('inquiry-contractor', inquiryContractorMailFormData.value)
  showNoti()
}

const onSubmitInquiryUserMailSetting = async () => {
  await mailSettingStore.handelUpdateMailSetting('inquiry-user', inquiryUserMailFormData.value)
  showNoti()
}

const onSubmitRegisterMailSetting = async () => {
  await mailSettingStore.handelUpdateMailSetting('register', registerMailFormData.value)
  showNoti()
}

const onSubmitWithdrawalMailSetting = async () => {
  await mailSettingStore.handelUpdateMailSetting('withdrawal', withdrawalMailFormData.value)
  showNoti()
}

const fetchMailSettings = async () => {
  const mailSettings = await mailSettingStore.handleMailSettings()
  if (mailSettings != null && mailSettings.length > 0) {
    mailSettings.forEach(element => {
      if (element.mail == 'contact') {
        contactMailFormData.value.subject = element.subject
        contactMailFormData.value.text = element.text
      } else if (element.mail == 'inquiry-thankyou') {
        inquiryThankYouMailFormData.value.subject = element.subject
        inquiryThankYouMailFormData.value.text = element.text
      } else if (element.mail == 'inquiry-contractor') {
        inquiryContractorMailFormData.value.subject = element.subject
        inquiryContractorMailFormData.value.text = element.text
      } else if (element.mail == 'inquiry-user') {
        inquiryUserMailFormData.value.subject = element.subject
        inquiryUserMailFormData.value.text = element.text
      } else if (element.mail == 'register') {
        registerMailFormData.value.subject = element.subject
        registerMailFormData.value.text = element.text
      } else if (element.mail == 'withdrawal') {
        withdrawalMailFormData.value.subject = element.subject
        withdrawalMailFormData.value.text = element.text
      }

    });
  }
}

onMounted(async () => {
  await fetchMailSettings()
})

// watch the loading
watchEffect(() => {
  // set area rows
  if (mailSettingStore._loading) {
    $q.loading.show()
  } else {
    $q.loading.hide()
  }

}, [mailSettingStore._loading])

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
              <q-tabs v-model="tab" dense class="text-primary" active-color="primary" indicator-color="primary"
                align="justify" narrow-indicator>
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
                <q-form class="row" @submit="onSubmitContactMailSetting">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text" v-model="contactMailFormData.subject"
                      lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-editor v-model="contactMailFormData.text" :dense="$q.screen.lt.md" :toolbar="[
                      [
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          list: 'only-icons',
                          options: ['left', 'center', 'right', 'justify']
                        },
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          options: ['left', 'center', 'right', 'justify']
                        }
                      ],
                      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                      ['token', 'hr', 'link', 'custom_btn'],
                      ['print', 'fullscreen'],
                      [
                        {
                          label: $q.lang.editor.formatting,
                          icon: $q.iconSet.editor.formatting,
                          list: 'no-icons',
                          options: [
                            'p',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'code'
                          ]
                        },
                        {
                          label: $q.lang.editor.fontSize,
                          icon: $q.iconSet.editor.fontSize,
                          fixedLabel: true,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7'
                          ]
                        },
                        'removeFormat'
                      ],
                      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                      ['undo', 'redo'],
                      ['viewsource']
                    ]" lazy-rules :rules="[
  val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </q-form>
              </q-tab-panel>

              <q-tab-panel name="inquiry-thankyou">
                <div class="text-subtitle1">お問い合わせ（サンキュー）メール設定</div>
                <div class="text-subtitle2 text-weight-light q-mb-md">お問い合わせフォーム自動返信メールの設定です。 このメールはアンケート回答後に送信されます。</div>
                <q-form class="row" @submit="onSubmitInquiryThankYouMailSetting">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text"
                      v-model="inquiryThankYouMailFormData.subject" lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-editor v-model="inquiryThankYouMailFormData.text" :dense="$q.screen.lt.md" :toolbar="[
                      [
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          list: 'only-icons',
                          options: ['left', 'center', 'right', 'justify']
                        },
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          options: ['left', 'center', 'right', 'justify']
                        }
                      ],
                      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                      ['token', 'hr', 'link', 'custom_btn'],
                      ['print', 'fullscreen'],
                      [
                        {
                          label: $q.lang.editor.formatting,
                          icon: $q.iconSet.editor.formatting,
                          list: 'no-icons',
                          options: [
                            'p',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'code'
                          ]
                        },
                        {
                          label: $q.lang.editor.fontSize,
                          icon: $q.iconSet.editor.fontSize,
                          fixedLabel: true,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7'
                          ]
                        },
                        'removeFormat'
                      ],
                      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                      ['undo', 'redo'],
                      ['viewsource']
                    ]" lazy-rules :rules="[
  val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </q-form>
              </q-tab-panel>

              <q-tab-panel name="inquiry-contractor">
                <div class="text-subtitle1">お問い合わせ（サンキュー）メール設定</div>
                <div class="text-subtitle2 text-weight-light q-mb-md">お問い合わせ自動返信メールの設定です。 このメールは、お問い合わせを受け付けた契約者宛に送信されます。
                </div>
                <q-form class="row" @submit="onSubmitInquiryContractorMailSetting">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text"
                      v-model="inquiryContractorMailFormData.subject" lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-editor v-model="inquiryContractorMailFormData.text" :dense="$q.screen.lt.md" :toolbar="[
                      [
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          list: 'only-icons',
                          options: ['left', 'center', 'right', 'justify']
                        },
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          options: ['left', 'center', 'right', 'justify']
                        }
                      ],
                      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                      ['token', 'hr', 'link', 'custom_btn'],
                      ['print', 'fullscreen'],
                      [
                        {
                          label: $q.lang.editor.formatting,
                          icon: $q.iconSet.editor.formatting,
                          list: 'no-icons',
                          options: [
                            'p',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'code'
                          ]
                        },
                        {
                          label: $q.lang.editor.fontSize,
                          icon: $q.iconSet.editor.fontSize,
                          fixedLabel: true,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7'
                          ]
                        },
                        'removeFormat'
                      ],
                      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                      ['undo', 'redo'],
                      ['viewsource']
                    ]" lazy-rules :rules="[
  val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </q-form>
              </q-tab-panel>

              <q-tab-panel name="inquiry-user">
                <div class="text-subtitle1">お問い合わせ（利用者）メール設定</div>
                <div class="text-subtitle2 text-weight-light q-mb-md">お問い合わせ自動返信メールの設定です。
                  このメールは、お問い合わせを受け付けたユーザーのメールアドレスに送信されます。</div>
                <q-form class="row"  @submit="onSubmitInquiryUserMailSetting">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text"
                      v-model="inquiryUserMailFormData.subject" lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-editor v-model="inquiryUserMailFormData.text" :dense="$q.screen.lt.md" :toolbar="[
                      [
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          list: 'only-icons',
                          options: ['left', 'center', 'right', 'justify']
                        },
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          options: ['left', 'center', 'right', 'justify']
                        }
                      ],
                      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                      ['token', 'hr', 'link', 'custom_btn'],
                      ['print', 'fullscreen'],
                      [
                        {
                          label: $q.lang.editor.formatting,
                          icon: $q.iconSet.editor.formatting,
                          list: 'no-icons',
                          options: [
                            'p',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'code'
                          ]
                        },
                        {
                          label: $q.lang.editor.fontSize,
                          icon: $q.iconSet.editor.fontSize,
                          fixedLabel: true,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7'
                          ]
                        },
                        'removeFormat'
                      ],
                      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                      ['undo', 'redo'],
                      ['viewsource']
                    ]" lazy-rules :rules="[
  val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </q-form>
              </q-tab-panel>

              <q-tab-panel name="register">
                <div class="text-subtitle1">メール設定を登録する</div>
                <div class="text-subtitle2 text-weight-light q-mb-md">このメールは登録完了後に送信されます。</div>
                <q-form class="row" @submit="onSubmitRegisterMailSetting">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text"
                      v-model="registerMailFormData.subject" lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-editor v-model="registerMailFormData.text" :dense="$q.screen.lt.md" :toolbar="[
                      [
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          list: 'only-icons',
                          options: ['left', 'center', 'right', 'justify']
                        },
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          options: ['left', 'center', 'right', 'justify']
                        }
                      ],
                      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                      ['token', 'hr', 'link', 'custom_btn'],
                      ['print', 'fullscreen'],
                      [
                        {
                          label: $q.lang.editor.formatting,
                          icon: $q.iconSet.editor.formatting,
                          list: 'no-icons',
                          options: [
                            'p',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'code'
                          ]
                        },
                        {
                          label: $q.lang.editor.fontSize,
                          icon: $q.iconSet.editor.fontSize,
                          fixedLabel: true,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7'
                          ]
                        },
                        'removeFormat'
                      ],
                      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                      ['undo', 'redo'],
                      ['viewsource']
                    ]" lazy-rules :rules="[
  val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </q-form>
              </q-tab-panel>

              <q-tab-panel name="withdrawal">
                <div class="text-subtitle1">退会メール設定。</div>
                <div class="text-subtitle2 text-weight-light q-mb-md">このメールは退会完了後に送信されます。</div>
                <q-form class="row" @submit="onSubmitWithdrawalMailSetting">
                  <div class="col-12">
                    <label>件名</label>
                    <q-input dense name="subject" outlined class="common-input-text"
                      v-model="withdrawalMailFormData.subject" lazy-rules :rules="[
                        val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
                      ]" />
                  </div>
                  <div class="col-12  q-mt-md">
                    <label>本文</label>
                    <q-editor v-model="withdrawalMailFormData.text" :dense="$q.screen.lt.md" :toolbar="[
                      [
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          list: 'only-icons',
                          options: ['left', 'center', 'right', 'justify']
                        },
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          options: ['left', 'center', 'right', 'justify']
                        }
                      ],
                      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                      ['token', 'hr', 'link', 'custom_btn'],
                      ['print', 'fullscreen'],
                      [
                        {
                          label: $q.lang.editor.formatting,
                          icon: $q.iconSet.editor.formatting,
                          list: 'no-icons',
                          options: [
                            'p',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'code'
                          ]
                        },
                        {
                          label: $q.lang.editor.fontSize,
                          icon: $q.iconSet.editor.fontSize,
                          fixedLabel: true,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7'
                          ]
                        },
                        'removeFormat'
                      ],
                      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                      ['undo', 'redo'],
                      ['viewsource']
                    ]" lazy-rules :rules="[
  val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です',
]" />
                  </div>
                  <div class="col-12 q-mt-lg">
                    <q-btn type="submit" class="p-common-btn" label="変更内容を保存" />
                  </div>
                </q-form>
              </q-tab-panel>
            </q-tab-panels>

          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>