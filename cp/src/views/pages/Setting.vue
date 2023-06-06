<script setup>
import { useQuasar } from 'quasar'
import { ref, watch, onMounted } from 'vue' 
import { useSettingStore } from '@/stores/setting'

const $q = useQuasar()
const settingStore = useSettingStore()

const tab = ref('site-settings')

const typeOptions = [
  'Website',
  'Article',
  'Blog',
  'Profile',
  'Business'
]

const localeOptions = [
  'en_US',
  'ja_JP',
]

const settingForm = ref(null)
const siteSize = ref(null)
const cacheSize = ref(null)
const formDataSetting = ref({
  'site_name': null,
  'description': null,
  'keywords': null,
  'site_logo': null,
  'site_logo_local_src': null,
  'icon': null,
  'icon_local_src': null,
  'email': null,
  'footer_text': null
})

const formDataSEO = ref({
  'type': null,
  'locale': null,
  'title': null,
  'description': null,
  'url': null,
  'image': null,
  'image_local_src': null,
  'image_width': null,
  'image_height': null
})

const onSubmit = async () => {
  
  await settingStore.handleUpdateSettings('setting', formDataSetting.value)
  if(settingStore._success) {
    $q.notify({
      caption: 'コンテンツが正常に更新されました',
      message: '成功！',
      type: 'positive',
      timeout: 1000
    })
    settingStore.storeSuccess(false)
  }

  if(settingStore._error) {
    $q.notify({
      caption: 'エラーが発生しました。後でもう一度お試しください。',
      message: 'エラー！',
      type: 'negative',
      timeout: 1000
    })
    settingStore.storeError(false)
  }

}

const onSubmitSEO = async () => {
  
  await settingStore.handleUpdateSettings('seo', formDataSEO.value)
  if(settingStore._success) {

    settingStore.storeSuccess(false)
  }

  if(settingStore._error) {


    settingStore.storeError(false)
  }
}

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const srcUrl = event.target.result
      resolve(srcUrl);
    };
    reader.onerror = (event) => {
      reject(event.target.error)
    };
    reader.readAsDataURL(file)
  })
}

watch(
  () => [formDataSetting.value, formDataSEO.value],
  async () => {
    if(formDataSetting.value.site_logo != null) {
      const src = await getBase64(formDataSetting.value.site_logo)
      formDataSetting.value.site_logo_local_src = src
    }

    if(formDataSetting.value.icon != null) {
      const src = await getBase64(formDataSetting.value.icon)
      formDataSetting.value.icon_local_src = src
    }

    if(formDataSEO.value.image != null) {
      const src = await getBase64(formDataSEO.value.image)
      formDataSEO.value.image_local_src = src
    }

  },
  { deep: true }
)

const handleRemoveImage = (key) => {
  if(key == 'setting_site_logo') {
    formDataSetting.value.site_logo = null
    formDataSetting.value.site_logo_local_src = null
  } else if(key == 'setting_icon') {
    formDataSetting.value.icon = null
    formDataSetting.value.icon_local_src = null
  } else if(key == 'seo_image') {
    formDataSEO.value.image = null
    formDataSEO.value.image_local_src = null
  }
}


onMounted(async () => {
  await settingStore.handleGetSettings()
  if(settingStore._settings != null) {
    formDataSetting.value = settingStore._settings
  }

  if(settingStore._seos != null) {
    formDataSEO.value = settingStore._seos
  }

  siteSize.value = settingStore._siteSize
  cacheSize.value = settingStore._cacheSize

})

const navPass = async (id) => {
  await settingStore.handleGetSettings()
}

const clearCache = async () => {
  const res = await settingStore.handleClearCache()
}

</script>
<template>
    <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
          <q-breadcrumbs-el label="ユーザー" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            ユーザー
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
              <div class="common-card-ttl"></div>
            </q-card-section>
            <q-card-section class="q-px-none">
              <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="site-settings" label="サイト設定" @click="navPass('setting')" />
                <q-tab name="seo" label="SEO"  @click="navPass('seo')"/>
              </q-tabs>
              <q-separator />
              <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="site-settings">
                  <div class="q-mt-xl">
                    <q-form
                      ref="settingForm"
                      @submit="onSubmit"
                      class="q-gutter-md"
                    >
                      <div class="row q-px-lg q-mt-none">
                        <div class="col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6">
                          <div class="row items-top items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">ウェブサイト名</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-input  
                                name="site_name"
                                outlined 
                                dense
                                class="common-input-text" 
                                v-model="formDataSetting.site_name"
                              />
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">の説明</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8">
                              <div>
                                <q-input 
                                  type="textarea"
                                  name="title" 
                                  outlined 
                                  dense
                                  v-model="formDataSetting.description"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">キーワード</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-input  
                                outlined 
                                dense
                                class="common-input-text" 
                                v-model="formDataSetting.keywords"
                              />
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">サイトのロゴ</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-file
                                v-model="formDataSetting.site_logo"
                                label="画像を選択"
                                outlined
                                dense
                                accept=".jpg,.png, image/*"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="attach_file" />
                                </template>
                              </q-file>
                              <div class="q-mt-sm" v-if="formDataSetting.site_logo_local_src != null">
                                <q-img
                                  :src="formDataSetting.site_logo_local_src"
                                  loading="lazy"
                                  spinner-color="white"
                                  style="max-width: 250px; height: 140px;"
                                  fit="contain"
                                >
                                  <q-btn @click="handleRemoveImage('setting_site_logo')" class="absolute-top-right all-pointer-events" size="xs" round color="negative" icon="mdi-close" />
                                </q-img>                    
                              </div>
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">アイコン</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-file
                                v-model="formDataSetting.icon"
                                label="画像を選択"
                                outlined
                                dense
                                accept=".jpg,.png, image/*"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="attach_file" />
                                </template>
                              </q-file>
                              <div class="q-mt-sm" v-if="formDataSetting.icon_local_src != null">
                                <q-img
                                  :src="formDataSetting.icon_local_src"
                                  loading="lazy"
                                  spinner-color="white"
                                  style="max-width: 250px; height: 140px;"
                                  fit="contain"
                                >
                                  <q-btn @click="handleRemoveImage('setting_icon')" class="absolute-top-right all-pointer-events" size="xs" round color="negative" icon="mdi-close" />
                                </q-img>                    
                              </div>
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">メール</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-input 
                                v-model="formDataSetting.email"
                                dense
                                outlined 
                                class="common-input-text" 
                              />
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">フッターテキスト</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 ">
                              <q-input
                                type="textarea" 
                                v-model="formDataSetting.footer_text"
                                dense
                                outlined 
                              />
                            </div>
                          </div>
                          <div class="row items-top q-mt-md">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-btn type="submit" class="p-common-btn" label="変更を保存" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-form>
                    <q-separator class="q-my-md" />
                      <div class="row q-px-lg q-mt-none">
                        <div class="col-6">
                          <div class="row items-top items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">サイトデータ</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              {{ siteSize }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row q-px-lg q-mt-md">
                        <div class="col-6">
                          <div class="row items-top items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">キャッシュサイズ</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <span>{{ cacheSize }}</span>
                              <q-btn @click="clearCache" size="sm" flat round color="negative" icon="mdi-trash-can-outline" />
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="seo">
                  <div class="q-mt-xl">
                    <q-form
                      ref="settingForm"
                      @submit="onSubmitSEO"
                      class="q-gutter-md"
                    >
                      <div class="row q-px-lg q-mt-none">
                        <div class="col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6">
                          <div class="row items-top items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">タイプ</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-select
                                outlined 
                                dense
                                v-model="formDataSEO.type"
                                :options="typeOptions"
                              />
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">ロケール</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-select
                                outlined 
                                dense
                                v-model="formDataSEO.locale"
                                :options="localeOptions"
                              />
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">タイトル</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-input 
                                outlined 
                                dense
                                class="common-input-text" 
                                v-model="formDataSEO.title"
                              />
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">の説明</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8">
                              <div>
                                <q-input 
                                  type="textarea"
                                  name="title" 
                                  outlined 
                                  dense
                                  v-model="formDataSEO.description"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">URL</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-input 
                                outlined 
                                dense
                                class="common-input-text" 
                                v-model="formDataSEO.url"
                              />
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">画像</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-file
                                v-model="formDataSEO.image"
                                label="画像を選択"
                                outlined
                                dense
                                accept=".jpg,.png, image/*"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="attach_file" />
                                </template>
                              </q-file>
                              <div class="q-mt-sm" v-if="formDataSEO.image_local_src != null">
                                <q-img
                                  :src="formDataSEO.image_local_src"
                                  loading="lazy"
                                  spinner-color="white"
                                  style="max-width: 250px; height: 140px;"
                                  fit="contain"
                                >
                                  <q-btn @click="handleRemoveImage('seo_image')" class="absolute-top-right all-pointer-events" size="xs" round color="negative" icon="mdi-close" />
                                </q-img>                    
                              </div>
                            </div>
                          </div>
                          <div class="row items-top q-mt-md items-center">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                              <label class="">画像サイズ</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <div class="row justify-between">
                                <div class="col-5">
                                  <q-input 
                                    type="number"
                                    outlined 
                                    dense
                                    class="common-input-text" 
                                    label="幅" 
                                    stack-label
                                    v-model="formDataSEO.image_width"
                                  />
                                </div>
                                <div class="col-5">
                                  <q-input 
                                    type="number"
                                    outlined 
                                    dense
                                    class="common-input-text" 
                                    label="身長" 
                                    stack-label=""
                                    v-model="formDataSEO.image_height"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="row items-top q-mt-md">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-8 form-input">
                              <q-btn type="submit" class="p-common-btn" label="変更を保存" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-form>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
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