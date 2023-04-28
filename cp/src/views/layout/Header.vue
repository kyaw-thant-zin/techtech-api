<script setup>
  // Import Quasar css
  import 'quasar/dist/quasar.css'
  import { ref, watchEffect } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const activeLink = ref()

  // sidebar nav menu list
  const menuList = [
    {
      label: 'ホーム',
      path: '/admin/dashboard',
      icon: 'mdi-home-variant-outline',
    },
    {
      label: '問い合わせ',
      path: '/admin/inquiry',
      icon: 'mdi-email-multiple-outline',
    },
    {
      label: 'ユーザー',
      path: '/admin/user',
      icon: 'mdi-account-multiple-outline',
    },
    {
      label: '請負業者',
      path: '/admin/contractor',
      icon: 'mdi-account-multiple-check-outline',
    },
    {
      label: '登録',
      icon: 'mdi-account-box',
      hasChild: true,
      children: [
        {
          label: 'エリア',
          path: '/admin/registration/area',
          icon: 'mdi-map-marker',
        },
        {
          label: '対応可能な施工',
          path: '/admin/registration/work',
          icon: 'mdi-briefcase-outline',
        },
      ]
    },
    {
      label: 'コンタクト',
      path: '/admin/contact',
      icon: 'mdi-mailbox-up-outline',
    },
    {
      label: '設定',
      path: '/admin/setting',
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

</script>

<template>
  <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          TECHTECH
        </q-toolbar-title>
        <q-space />
        <q-btn size="md" flat class="q-ml-md" to="/" icon="mdi-logout-variant"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer class="l-sb" show-if-above v-model="drawer" side="left" bordered :width="245">
        <q-scroll-area class="fit">
          <q-list>
            <template v-for="(menuItem, index) in menuList" :key="index">
              <div v-if="!menuItem?.hasChild">
                <router-link :to="menuItem.path">
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
                  class="q-mt-md"
                  :icon="menuItem.icon"
                  :label="menuItem.label"
                >
                  <q-list class="q-ml-md">
                    <template v-if="menuItem?.children">
                      <template v-for="(menuChild, index) in menuItem.children">
                        <router-link :to="menuChild.path">
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