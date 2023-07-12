<script setup>
import dayjs from 'dayjs'
import { APP } from '@/config.js'
import relativeTime from 'dayjs/plugin/relativeTime'
import {ref, watchEffect} from 'vue'
import {useDashboardStore} from '@/stores/dashboard'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const dashboardStore = useDashboardStore()
const contractorCount = ref(0)
const mailCount = ref(0)
const contractors = ref([])
const mails = ref([])
const inquiries = ref([])
const inquiryCount = ref(0)
dashboardStore.handleGetDashboard()
dayjs.extend(relativeTime)

watchEffect(() => {
    
    contractors.value = dashboardStore._contractors
    mails.value = dashboardStore._mails
    contractorCount.value = dashboardStore._contractorCount
    mailCount.value = dashboardStore._mailCount
    inquiries.value = dashboardStore._inquiries
    inquiryCount.value = dashboardStore._inquiryCount

}, [dashboardStore._contractors, dashboardStore._mails, dashboardStore._contractorCount, dashboardStore._mailCount])

const redirectToDetail = (routeName, routeParams) => {
    dashboardStore.router.replace({name: routeName, params: { id: routeParams}})
}

</script>
<template>
    <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="ホーム" icon="mdi-home-variant-outline" :to="{ name: 'admin.dashboard' }" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            ホーム
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-sm">
        <div class="col-12">
            <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-5 col-md-3 col-lg-3 col-xl-3">
                    <q-card class="common-card">
                        <q-card-section horizontal>
                            <q-card-section class="col-4 flex flex-center">
                                <q-icon name="mdi-briefcase-account-outline" size="xl" />
                            </q-card-section>
                            <q-separator vertical inset />
                            <q-card-section class="col-5 flex flex-center">
                                <div class="text-body1 text-bold">
                                    {{ contractorCount }}
                                </div>
                            </q-card-section>
                        </q-card-section>

                        <q-separator />

                        <q-card-actions>
                            <div class="fit text-center">
                                トータルコントラクター
                            </div>
                        </q-card-actions>
                    </q-card>
                </div>
                <div class="col-12 col-sm-5 col-md-3 col-lg-3 col-xl-3">
                    <q-card class="common-card">
                        <q-card-section horizontal>
                            <q-card-section class="col-4 flex flex-center">
                                <q-icon name="mdi-card-account-mail-outline" size="xl" />
                            </q-card-section>
                            <q-separator vertical inset />
                            <q-card-section class="col-5 flex flex-center">
                                <div class="text-body1 text-bold">
                                    {{ inquiryCount }}
                                </div>
                            </q-card-section>
                        </q-card-section>

                        <q-separator />

                        <q-card-actions>
                            <div class="fit text-center">
                                総問い合わせ数
                            </div>
                        </q-card-actions>
                    </q-card>
                </div>
            </div>
            <div class="row q-mt-md q-col-gutter-md">
                <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="">
                        <q-card>
                            <q-card-section  class="q-pb-none">
                                <div>最近のお問い合わせ</div>
                            </q-card-section>
                            <q-card-section>
                                <q-list v-if="inquiries != null && inquiries.length > 0">
                                    <template  v-for="(iq, index) in inquiries">
                                        <q-item v-ripple clickable @click="redirectToDetail( 'cp.inquiry.detail', APP.encryptID(iq.id))">
                                            <q-item-section>
                                                <q-item-label>{{ iq.name }}</q-item-label>
                                                <q-item-label caption>{{ iq.email }}</q-item-label>
                                                <q-item-label caption>{{ iq.schedule }}</q-item-label>
                                                <q-item-label caption>{{ iq.total }}</q-item-label>
                                            </q-item-section>

                                            <q-item-section side top>
                                            <q-item-label caption>{{ dayjs(iq.date).fromNow() }}</q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-separator spaced inset v-if="index < contractors.length - 1" />
                                    </template>
                                </q-list>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
                <div class="col-12"></div>
                <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="">
                        <q-card>
                            <q-card-section  class="q-pb-none">
                                <div>最新の登録契約者</div>
                            </q-card-section>
                            <q-card-section>
                                <q-list v-if="contractors != null">
                                    <template  v-for="(con, index) in contractors">
                                        <q-item v-ripple clickable @click="redirectToDetail( 'cp.contractor.detail', APP.encryptID(con.id))">
                                            <q-item-section>
                                                <q-item-label>{{ con.name }}</q-item-label>
                                                <q-item-label caption>{{ con?.payment_info.plan }}</q-item-label>
                                                <q-item-label caption>{{ con.company_name }}</q-item-label>
                                            </q-item-section>

                                            <q-item-section side top>
                                            <q-item-label caption>{{ dayjs(con.created_at).fromNow() }}</q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-separator spaced inset v-if="index < contractors.length - 1" />
                                    </template>
                                </q-list>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
                <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div>
                        <q-card>
                            <q-card-section  class="q-pb-none">
                                <div>最新の連絡先</div>
                            </q-card-section>
                            <q-card-section>
                                <q-list v-if="mails != null">
                                    <template v-for="(mail, index) in mails">
                                        <q-item v-ripple clickable @click="redirectToDetail( 'cp.contact.detail', APP.encryptID(mail.id))">
                                            <q-item-section>
                                                <q-item-label>{{ mail.name }}</q-item-label>
                                                <q-item-label caption>{{ mail.email }}</q-item-label>
                                                <q-item-label caption>{{ mail.company_name }}</q-item-label>
                                            </q-item-section>

                                            <q-item-section side top>
                                                <q-item-label caption>{{ dayjs(mail.created_at).fromNow() }}</q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-separator spaced inset v-if="index < mails.length - 1"/>
                                    </template>
                                </q-list>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
