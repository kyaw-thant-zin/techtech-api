<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

// COMMON
import CommonHeader from '@/views/layout/common/Header.vue'
import CommonFooter from '@/views/layout/common/Footer.vue'
import CommonFooterContact from '@/views/layout/common/FooterContact.vue'

// ENTERPRISE
import EnterpriseHeader from '@/views/layout/enterprise/Header.vue'
import EnterpriseFooter from '@/views/layout/enterprise/Footer.vue'
import EnterpriseFooterContact from '@/views/layout/enterprise/FooterContact.vue'

// ADMIN
import AdminHeader from '@/views/layout/admin/Header.vue'
import AdminFooter from '@/views/layout/admin/Footer.vue'

const route = useRoute()
const layout = ref(null)

watchEffect(() => {
  layout.value = route.meta?.layout
})

const headerComponent = computed(() => {
  if(layout.value === 'common') {
    return CommonHeader
  } else {
    return EnterpriseHeader
  }
})

const footerContactComponent = computed(() => {
  if(layout.value === 'common') {
    return CommonFooterContact
  } else {
    return EnterpriseFooterContact
  }
})

const footerComponent = computed(() => {
  if(layout.value === 'common') {
    return CommonFooter
  } else {
    return EnterpriseFooter
  }
})


</script>

<template>
  <template v-if="layout === 'common' || layout === 'enterprise'">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Transition name="fade">
            <div id="page" class="site">
              <component :is="headerComponent"></component>
              <!-- <Header></Header> -->
              <div id="content" class="site-content">
                <div id="primary" class="content-area">
                  <Suspense>
                    <!-- main content -->
                    <component :is="Component"></component>

                    <!-- loading state -->
                    <template #fallback>
                      Loading...
                    </template>
                  </Suspense>
                </div>
              </div>
              <component :is="footerContactComponent"></component>
              <component :is="footerComponent"></component>
            </div>
          </Transition>
      </template>
    </RouterView>
  </template>
  <template v-else>
        <q-layout class="l" view="hHh lpR lff">
          <AdminHeader></AdminHeader>
          <q-page-container class="row fit min-height-fit">
            <RouterView v-slot="{ Component }">
              <template v-if="Component">
                  <Transition name="fade">
                    <div class="fit row min-height-fit">
                      <Suspense>
                          <!-- main content -->
                          <component :is="Component"></component>

                          <!-- loading state -->
                          <template #fallback>
                            Loading...
                          </template>
                        </Suspense>
                    </div>
                  </Transition>
              </template>
            </RouterView>
          </q-page-container>
          <AdminFooter></AdminFooter>
        </q-layout>
  </template>
</template>

<style scoped>
</style>
