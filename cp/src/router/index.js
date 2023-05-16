import { createRouter, createWebHistory } from 'vue-router'
import { API } from '../api'

// CP
import SignIn from '@/views/pages/auth/SignIn.vue'
import Dashboard from '@/views/pages/Dashboard.vue'
import InquiryIndex from '@/views/pages/Inquiry/Index.vue'
import UserIndex from '@/views/pages/User/Index.vue'
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
import ContactIndex from '@/views/pages/Contact/Index.vue'
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
          name: 'cp.contact',
          component: ContactIndex,
          meta: { requiresAuth: true, requiresSuperAdmin: true }
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
          meta: { requiresAuth: true }
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
  console.log('cp')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthUser = await checkAuth()
    if(isAuthUser) {
      if(to.matched.some(record => record.meta.requiresSuperAdmin) && isAuthUser.role_id == 3) {
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