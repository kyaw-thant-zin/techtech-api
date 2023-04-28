<script setup>

// ADMIN
import CpHeader from '@/views/layout/Header.vue'
import CpFooter from '@/views/layout/Footer.vue'

</script>

<template>
  <q-layout class="l" view="hHh lpR lff">
          <CpHeader></CpHeader>
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
          <CpFooter></CpFooter>
        </q-layout>
</template>

<style scoped>
</style>
