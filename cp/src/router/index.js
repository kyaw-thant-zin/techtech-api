import { createRouter, createWebHistory } from 'vue-router'
import { API } from '../api'

// CP
import SignIn from '@/views/pages/auth/SignIn.vue'
import Dashboard from '@/views/pages/Dashboard.vue'
import InquiryIndex from '@/views/pages/Inquiry/Index.vue'
import UserIndex from '@/views/pages/User/Index.vue'
import ContractorIndex from '@/views/pages/Contractor/Index.vue'
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
          path: 'sign-in',
          name: 'cp.signin',
          component: SignIn,
          meta: { requiresAuth: false, authLayout: false }
        },
        {
          path: 'dashboard',
          name: 'cp.dashboard',
          component: Dashboard,
          meta: { requiresAuth: true }
        },
        {
          path: 'inquiry',
          name: 'cp.inquiry',
          component: InquiryIndex,
          meta: { requiresAuth: true }
        },
        {
          path: 'user',
          name: 'cp.user',
          component: UserIndex,
          meta: { requiresAuth: true }
        },
        {
          path: 'contractor',
          name: 'cp.contractor',
          component: ContractorIndex,
          meta: { requiresAuth: true }
        },
        {
          path: 'contact',
          name: 'cp.contact',
          component: ContactIndex,
          meta: { requiresAuth: true }
        },
        {
          path: 'registration',
          children: [
            {
              path: 'area',
              children: [
                {
                  path: '',
                  name: 'cp.area',
                  component: AreaIndex,
                  meta: { requiresAuth: true }
                },
                {
                  path: 'create',
                  name: 'cp.area.create',
                  component: AreaCreate,
                  meta: { requiresAuth: true }
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
                  meta: { requiresAuth: true }
                },
                {
                  path: 'create',
                  name: 'cp.construction.create',
                  component: ConstructionCreate,
                  meta: { requiresAuth: true }
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
  ],
});

const checkAuth = async () => {
  const response = await API.auth.check()
  return response
}

router.beforeEach( async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if(await checkAuth()) {
      next()
      return
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