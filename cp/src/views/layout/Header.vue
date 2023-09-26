<script setup>
// Import Quasar css
import 'quasar/dist/quasar.css'
import { ref, watchEffect, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import { useSettingStore } from '@/stores/setting'
import { useSeoMeta, useHead } from 'unhead'

const authStore = useAuthStore()
const settingStore = useSettingStore()
const route = useRoute()
const activeLink = ref('')
const defaultOpenChild = ref({})

const settingHead = ref(null)
const settingSeo = ref(null)

// sidebar nav menu list
const menuList = [
  {
    label: 'ホーム',
    path: '/cp/dashboard',
    icon: 'mdi-home-variant-outline',
  },
  {
    label: '問い合わせ',
    path: '/cp/inquiry',
    icon: 'mdi-card-account-mail-outline',
  },
  // {
  //   label: 'ユーザー',
  //   path: '/cp/user',
  //   icon: 'mdi-account-multiple-outline',
  // },
  {
    label: '請負業者',
    path: '/cp/contractor',
    icon: 'mdi-briefcase-account-outline',
  },
  {
    label: '退会',
    icon: 'mdi-account-arrow-left-outline',
    hasChild: true,
    children: [
      {
        label: '目録',
        path: '/cp/withdrawal-request',
        icon: 'mdi-format-list-bulleted',
      },
      {
        label: '退会する理由',
        path: '/cp/leaving-reason',
        icon: 'mdi-message-reply-text-outline',
      },
    ]
  },
  {
    label: 'アンケート',
    path: '/cp/questionnaire',
    icon: 'mdi-comment-question-outline',
  },
  {
    label: 'お見積り',
    path: '/cp/quotation',
    icon: 'mdi-format-list-checkbox',
  },
  {
    label: '登録',
    icon: 'mdi-account-box',
    hasChild: true,
    children: [
      {
        label: 'お支払方法',
        path: '/cp/registration/payment-method',
        icon: 'mdi-credit-card-outline',
      },
      {
        label: 'エリア',
        path: '/cp/registration/area',
        icon: 'mdi-map-marker',
      },
      {
        label: '建設の種類',
        path: '/cp/registration/construction',
        icon: 'mdi-briefcase-outline',
      },
    ]
  },
  {
    label: 'コンタクト',
    path: '/cp/contact',
    icon: 'mdi-mailbox-up-outline',
  },
  {
    label: 'メンテナンス設定',
    path: '/cp/maintenance',
    icon: 'mdi-wrench-clock',
  },
  {
    label: 'メール設定',
    path: '/cp/mail-setting',
    icon: 'mdi-email-edit-outline',
  },
  {
    label: '設定',
    path: '/cp/setting',
    icon: 'mdi-cog-outline',
  },
]

function setChildMenuActive(activeLink) {
  for (const menuItem of menuList) {
    const key = menuItem.label
    
    if (menuItem.children && Array.isArray(menuItem.children) && menuItem.children.length > 0) {
      for(let i = 0; i < menuItem.children.length; i++) {
        const mc = menuItem.children[i]
        if(activeLink.includes(mc.path)) {
          defaultOpenChild.value[key] = true
          break
        } else {
          defaultOpenChild.value[key] = false
        }
      }
    }
  }
}


const setHeadAndSeo = () => {

  if (settingStore._head?.setting) {
    settingHead.value = settingStore._head.setting
  }

  if (settingStore._head?.seo) {
    settingSeo.value = settingStore._head.seo
  }

  useSeoMeta({
    title: settingHead.value.site_name,
    description: settingHead.value.description,
    keywords: settingHead.value.keywords,
    ogTitle: settingSeo.value.og_title,
    ogDescription: settingSeo.value.og_description,
    ogUrl: settingSeo.value.og_url,
    ogType: settingSeo.value.og_type,
    ogLocale: settingSeo.value.og_locale,
    ogImage: settingSeo.value.og_image,
    ogImageWidth: settingSeo.value.og_image_width,
    ogImageHeight: settingSeo.value.og_image_height
  })

  useHead({
    link: {
      rel: 'icon',
      type: 'image/png',
      href: settingHead.value.icon
    }
  })

  // set current route
  activeLink.value = authStore.router.currentRoute._value.path
  setChildMenuActive(activeLink.value)
}


onBeforeMount(async () => {
  await settingStore.handleGetSettings()
  setHeadAndSeo()
})

// trigger sidebar open and close
const leftDrawerOpen = ref(false)
const drawer = leftDrawerOpen
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleChildMenuClick = (childPath) => {
  activeLink.value = childPath
  setChildMenuActive(childPath)
}

watchEffect(() => {
  if(settingStore._activeLink != '') {
    activeLink.value = settingStore._activeLink
    setChildMenuActive(settingStore._activeLink)
  }
}, [settingStore._activeLink])


const signout = async () => {
  const condi = await authStore.handleSignOut(authStore._user?.id)
  if (!condi) {
    authStore.router.replace({ name: 'cp.signin' })
  }
}


</script>

<template>
  <q-header bordered class="p-hd hd">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
      <q-toolbar-title>
        <template v-if="settingHead != null && settingHead?.site_logo != null">
          <img :src="settingHead?.site_logo" alt="LOGO" class="hd-logo" />
        </template>
        <template v-else>
          <img src="@/assets/img/logo.png" alt="logo" class="hd-logo" />
        </template>
      </q-toolbar-title>
      <q-space />
      <q-btn size="md" flat class="q-ml-md" @click="signout()" icon="mdi-logout-variant"></q-btn>
    </q-toolbar>
  </q-header>

  <q-drawer class="l-sb" show-if-above v-model="drawer" side="left" bordered :width="245">
    <q-scroll-area class="fit">
      <q-list>
        <template v-for="(menuItem, index) in menuList" :key="index">
          <div v-if="!menuItem?.hasChild">
            <router-link :to="menuItem.path" class="p-menu-color">
              <q-item :data-activeLink="activeLink" :data-path="menuItem.path" class="q-mt-md" clickable
                :active="activeLink.includes(menuItem.path)" @click="handleChildMenuClick(menuItem.path)" active-class="active-sb"
                v-ripple>
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
            </router-link>
          </div>
          <div v-else>
            <q-expansion-item class="q-mt-md p-menu-color" :icon="menuItem.icon" :label="menuItem.label"
              v-model="defaultOpenChild[menuItem.label]" :data-linkactive="activeLink" :data-defaultOpenChild="defaultOpenChild">
              <q-list class="q-ml-md">
                <template v-if="menuItem?.children">
                  <template v-for="(menuChild, index) in menuItem.children">
                    <router-link :to="menuChild.path" class="p-menu-color">
                      <q-item clickable :active="activeLink.includes(menuChild.path)"
                        @click="handleChildMenuClick(menuChild.path)" active-class="active-sb" v-ripple>
                        <q-item-section avatar>
                          <q-icon :name="menuChild.icon" />
                        </q-item-section>
                        <q-item-section>
                          {{ menuChild.label }}
                        </q-item-section>
                      </q-item>
                    </router-link>
                  </template>
                </template>
              </q-list>
            </q-expansion-item>
          </div>
        </template>

      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<style scoped>
.active-sb {
  color: #1976d2;
  /* background-color: #4a4949; */
}
</style>