<script setup>
  // Import Quasar css
  import 'quasar/dist/quasar.css'
  import { ref, watchEffect, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/Auth'

  const authStore = useAuthStore()
  const route = useRoute()
  const activeLink = ref()

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
      label: '設定',
      path: '/cp/setting',
      icon: 'mdi-cog-outline',
    },
  ]
  // trigger sidebar open and close
  const leftDrawerOpen = ref(false)
  const drawer = leftDrawerOpen
  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  watchEffect( async () => {

    activeLink.value = route.path

  }, [route])


  const signout = async () => {
    const condi = await authStore.handleSignOut(authStore._user?.id)
    if(!condi) {
      authStore.router.replace({ name: 'cp.signin' })
    }
  }

</script>

<template>
  <q-header reveal bordered class="p-hd hd">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <img src="@/assets/img/logo.png" alt="logo" class="hd-logo">
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
                <q-item  class="q-mt-md" clickable :active="activeLink === menuItem.path" @click="activeLink = menuItem.path" active-class="active-sb" v-ripple>
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
                <q-expansion-item
                  class="q-mt-md p-menu-color"
                  :icon="menuItem.icon"
                  :label="menuItem.label"
                >
                  <q-list class="q-ml-md">
                    <template v-if="menuItem?.children">
                      <template v-for="(menuChild, index) in menuItem.children">
                        <router-link :to="menuChild.path" class="p-menu-color">
                          <q-item clickable :active="activeLink === menuChild.path" @click="activeLink = menuChild.path" active-class="active-sb" v-ripple>
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