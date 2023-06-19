import { createRouter, createWebHistory } from 'vue-router'
import { API } from '../api'
import { useAuthStore } from '../stores/auth'

// CP
import SignIn from '@/views/pages/auth/SignIn.vue'
import Dashboard from '@/views/pages/Dashboard.vue'
import InquiryIndex from '@/views/pages/Inquiry/Index.vue'
import UserIndex from '@/views/pages/User/Index.vue'
// Contractor
import ContractorIndex from '@/views/pages/Contractor/Index.vue'
import ContractorView from '@/views/pages/Contractor/View.vue'
// Payment Method
import PMIndex from '@/views/pages/Registration/Method/Index.vue'
import PMCreate from '@/views/pages/Registration/Method/Create.vue'
// Area
import AreaIndex from '@/views/pages/Registration/Area/Index.vue'
import AreaCreate from '@/views/pages/Registration/Area/Create.vue'
// Construction
import ConstructionIndex from '@/views/pages/Registration/Construction/Index.vue'
import ConstructionCreate from '@/views/pages/Registration/Construction/Create.vue'
// Questionnaire
import QuestIndex from '@/views/pages/Questionnaire/Index.vue'
import QuestCreate from '@/views/pages/Questionnaire/Create.vue'
import QuestView from '@/views/pages/Questionnaire/View.vue'
// Quotation
import QuotationIndex from '@/views/pages/Quotation/Index.vue'
import QuotationCreate from '@/views/pages/Quotation/Create.vue'
// Contact
import ContactIndex from '@/views/pages/Contact/Index.vue'
import ContactView from '@/views/pages/Contact/View.vue'
// Setting
import Setting from '@/views/pages/Setting.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cp',
      name: 'cp',
      children: [
        {
          path: '',
          name: 'cp.home',
          component: SignIn,
          meta: { requiresAuth: false, authLayout: false }
        },
        {
          path: 'sign-in',
          name: 'cp.signin',
          component: SignIn,
          meta: { requiresAuth: false, authLayout: false }
        },
        {
          path: 'dashboard',
          name: 'cp.dashboard',
          component: Dashboard,
          meta: { requiresAuth: true, requiresSuperAdmin: true }
        },
        {
          path: 'inquiry',
          name: 'cp.inquiry',
          component: InquiryIndex,
          meta: { requiresAuth: true, requiresSuperAdmin: true }
        },
        {
          path: 'user',
          name: 'cp.user',
          component: UserIndex,
          meta: { requiresAuth: true, requiresSuperAdmin: true }
        },
        {
          path: 'contractor',
          children: [
            {
              path: '',
              name: 'cp.contractor',
              component: ContractorIndex,
              meta: { requiresAuth: true, requiresSuperAdmin: true }
            },
            {
              path: ':id/detail',
              name: 'cp.contractor.detail',
              component: ContractorView,
              meta: { requiresAuth: true, requiresSuperAdmin: true }
            },
          ]
        },
        {
          path: 'contact',
          children: [
            {
              path: '',
              name: 'cp.contact',
              component: ContactIndex,
              meta: { requiresAuth: true, requiresSuperAdmin: true }
            },
            {
              path: ':id/detail',
              name: 'cp.contact.detail',
              component: ContactView,
              meta: { requiresAuth: true, requiresSuperAdmin: true }
            },
          ]
        },
        {
          path: 'questionnaire',
          children: [
            {
              path: '',
              name: 'cp.questionnaire',
              component: QuestIndex,
              meta: { requiresAuth: true, requiresSuperAdmin: true }
            },
            {
              path: 'create',
              name: 'cp.questionnaire.create',
              component: QuestCreate,
              meta: { requiresAuth: true, requiresSuperAdmin: true }
            },
            {
              path: ':id/detail',
              name: 'cp.questionnaire.detail',
              component: QuestView,
              meta: { requiresAuth: true, requiresSuperAdmin: true }
            },
          ]
        },
        {
          path: 'quotation',
          children: [
            {
              path: '',
              name: 'cp.quotation',
              component: QuotationIndex,
              meta: { requiresAuth: true, requiresSuperAdmin: true }
            },
            {
              path: 'create',
              name: 'cp.quotation.create',
              component: QuotationCreate,
              meta: { requiresAuth: true, requiresSuperAdmin: true }
            },
          ]
        },
        {
          path: 'registration',
          children: [
            {
              path: 'payment-method',
              children: [
                {
                  path: '',
                  name: 'cp.pm',
                  component: PMIndex,
                  meta: { requiresAuth: true, requiresSuperAdmin: true }
                },
                {
                  path: 'create',
                  name: 'cp.pm.create',
                  component: PMCreate,
                  meta: { requiresAuth: true, requiresSuperAdmin: true }
                }
              ]
            },
            {
              path: 'area',
              children: [
                {
                  path: '',
                  name: 'cp.area',
                  component: AreaIndex,
                  meta: { requiresAuth: true, requiresSuperAdmin: true }
                },
                {
                  path: 'create',
                  name: 'cp.area.create',
                  component: AreaCreate,
                  meta: { requiresAuth: true, requiresSuperAdmin: true }
                }
              ]
            },
            {
              path: 'construction',
              children: [
                {
                  path: '',
                  name: 'cp.construction',
                  component: ConstructionIndex,
                  meta: { requiresAuth: true, requiresSuperAdmin: true }
                },
                {
                  path: 'create',
                  name: 'cp.construction.create',
                  component: ConstructionCreate,
                  meta: { requiresAuth: true, requiresSuperAdmin: true }
                }
              ]
            },
          ]
        },
        {
          path: 'setting',
          name: 'cp.setting',
          component: Setting,
          meta: { requiresAuth: true, requiresSuperAdmin: true }
        },
      ]
    },
    {
      path: '/:catchAll(.*)',
      name: 'cp.notfound',
      component: SignIn,
      meta: { requiresAuth: false, authLayout: false }
    },
  ],
});

const checkAuth = async () => {
  const response = await API.auth.check()
  return response
}

router.beforeEach( async (to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthUser = await checkAuth()
    if(isAuthUser) {
      if(to.matched.some(record => record.meta.requiresSuperAdmin) && isAuthUser.role_id == 3) {
        const authStore = useAuthStore()
        authStore._user = isAuthUser
        next()
        return
      } else {
        next(false); // Cancel the current navigation
        router.back(); // Go back to the previous route
        return 
      }
    } else {
      next({
        name: 'cp.signin'
      })
      return 
    }
  }
  next()
  return
})


export default router;