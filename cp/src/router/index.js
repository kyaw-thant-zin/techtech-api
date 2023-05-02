import { createRouter, createWebHistory } from 'vue-router'

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
          meta: { requiresAuth: false }
        },
        {
          path: 'inquiry',
          name: 'cp.inquiry',
          component: InquiryIndex,
          meta: { requiresAuth: false }
        },
        {
          path: 'user',
          name: 'cp.user',
          component: UserIndex,
          meta: { requiresAuth: false }
        },
        {
          path: 'contractor',
          name: 'cp.contractor',
          component: ContractorIndex,
          meta: { requiresAuth: false }
        },
        {
          path: 'contact',
          name: 'cp.contact',
          component: ContactIndex,
          meta: { requiresAuth: false }
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
                  meta: { requiresAuth: false }
                },
                {
                  path: 'create',
                  name: 'cp.area.create',
                  component: AreaCreate,
                  meta: { requiresAuth: false }
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
                  meta: { requiresAuth: false }
                },
                {
                  path: 'create',
                  name: 'cp.construction.create',
                  component: ConstructionCreate,
                  meta: { requiresAuth: false }
                }
              ]
            },
          ]
        },
        {
          path: 'setting',
          name: 'cp.setting',
          component: Setting,
          meta: { requiresAuth: false }
        },
      ]
    },
  ],
});

router.beforeEach( async (to, from, next) => {
  if (to.meta.requiresAuth) {
    console.log('next auth')
    return
  }
  next()
  return
})


export default router;