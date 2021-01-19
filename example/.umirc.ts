import { defineConfig } from 'umi'
import { join } from 'path'

function resolve(path: string) {
  return join(__dirname, 'src', path)
}

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    {
      path: '/login',
      component: '@/pages/login',
    },
    {
      path: '/register',
      component: '@/pages/register',
    },
    {
      path: '/templates',
      component: '@/pages/templates',
    },
    {
      path: '/ui-demo',
      component: '@/pages/ui-demo',
    },

    {
      path: '/dashboard',
      component: '@/pages/dashboard',
    },
    {
      path: '/spaces/:spaceId',
      component: '@/layouts/DashboardLayout',
      routes: [
        {
          path: ':tableId',
          component: '@/layouts/TableLayout',
          routes: [
            {
              path: ':viewId',
              component: '@/pages/table',
            },
          ],
        },
      ],
    },

    {
      path: '/account',
      component: '@/layouts/AccountLayout',
      routes: [
        {
          path: 'profile',
          component: '@/pages/profile',
        },
        {
          path: 'token',
          component: '@/pages/token',
        },
        {
          path: 'password',
          component: '@/pages/password',
        },
        {
          path: 'notifications',
          component: '@/pages/notifications',
        },
        {
          path: 'safety',
          component: '@/pages/safety',
        },
      ],
    },

    { component: '@/pages/not-found' },
  ],

  alias: {
    '@modals': resolve('modals/'),
    '@drawers': resolve('drawers/'),
    '@generated': resolve('generated/'),
  },
})
