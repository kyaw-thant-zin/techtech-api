<script setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { APP } from '@/config.js'
import { useQuasar } from 'quasar'
import { ref, watchEffect, computed } from 'vue'
import { useContactStore } from '@/stores/contact';


const $q = useQuasar()
const contactStore = useContactStore()
const id = computed(() => APP.decryptID(contactStore.router.currentRoute._value.params.id.toString()))
contactStore.handleGetContact(id)
dayjs.extend(relativeTime)

const contact = ref(null)

watchEffect(() => {
    // set area rows
    if(contactStore._contact !== null) {
      contact.value = contactStore._contact
      if(contact.value[0].new == 1) {
        contactStore.handleUpdateContactNew(id)
      }
    } else {
      contact.value = null
    }

}, [contactStore._contact])

</script>
<template>
    <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
          <q-breadcrumbs-el label="コンタクト" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            コンタクト
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
              <div class="row" v-if="contact != null" v-for="con in contact">
                <div class="col-12">
                  <q-list bordered padding>
                    <q-item>
                      <q-item-section top avatar>
                        <q-avatar color="primary" text-color="white" square icon="mdi-account" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ con.email }}</q-item-label>
                        <q-item-label>{{ con.company_name }}</q-item-label>
                        <q-item-label caption>{{ con.name }}</q-item-label>
                        <q-item-label caption>{{ con.kana_name }}</q-item-label>
                        <q-item-label caption>{{ con.tel }}</q-item-label>
                        <q-item-label caption>{{ con.address01 }} {{ con.address02 }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div class="col-12">
                  <div class="q-px-lg q-py-md"  v-if="contact != null"> 
                    <q-timeline color="secondary">
                      <q-timeline-entry
                        icon="email"
                      >
                        <template v-slot:subtitle>
                          {{ dayjs(con.created_at).fromNow() }}
                        </template>
                        <div>{{ con.content }}</div>
                      </q-timeline-entry>
                    </q-timeline>
                  </div>
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