import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '数据可视化', icon: 'dashboard', affix: true}
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/

  
  {
    path: '/devices',
    component: Layout,
    //meta: {title: 'device', icon: 'el-icon-s-platform' ,roles: [2,3]},
    children: [
      {
        path: 'index',
        component: () => import('@/views/pages/devices/device.vue'),
        name: 'devices',
        meta: { title: 'device', icon: 'el-icon-s-platform', roles: [2,3] }
      } ,
      // {
      //   path: 'smt',
      //   component: () => import('@/views/pages/devices/device-smt.vue'),
      //   name: 'devices_smt',
      //   meta: { title: 'smt_device', icon: 'el-icon-s-platform', roles: [2,3] }
      // } 
    ]
  },
  {
    path: '/lines',
    component: Layout,
    meta:{ roles: [2,3]},
    children: [
      {
        path: '/index',
        component: () => import('@/views/pages/lines/line.vue'),
        name: 'lines',
        meta: { title: 'line', icon: 'example' , roles: [2,3] }
      }
    ]
  },
  {
    path: '/alarms',
    component: Layout,
    meta: { title: '告警日志', icon: 'bug' ,roles: [2,3]},
    children: [
      {
        path: 'log',
        component: () => import('@/views/pages/alarms/alarm-log.vue'),
        name: 'log',
        meta: { title: '告警记录', icon: 'documentation' }
      },
      {
        path: 'index',
        component: () => import('@/views/pages/alarms/alarm.vue'),
        name: 'alarm',
        meta: { title: '告警事件处理', icon: 'form' , roles: [2,3] }
      },
      
    ],
  },

  {
    path: '/vibration',
    component: Layout,
    meta: {title: '振动数据管理', icon: 'el-icon-school'},
    children: [
      {
        path: 'data',
        component: () => import('@/views/pages/data/data.vue'),
        name: 'data',
        meta: { title: '振动数据查询', icon: 'table' }
      },
      // {
      //   path: 'vibrationTuBiao',
      //   component: () => import('@/views/pages/vibration/vibrationTuBiao.vue'),
      //   name: 'vibrationTuBiao',
      //   meta: { title: '振动波形展示', icon: 'el-icon-film' }
      // }
      
    ]
  },
  {
    path: '/userManage',
    component: Layout,
    meta: {title: '人员管理', icon: 'el-icon-s-custom'},
    children: [
       {
        path: 'jurisdictionManage',
        component: () => import('@/views/pages/userManage/jurisdictionManage.vue'),
        name: 'jurisdictionManage',
        meta: { title: '巡检人员设置', icon: 'el-icon-s-cooperation' }
      },
      {
        path: 'roles',
        component: () => import('@/views/pages/permission/role.vue'),
        name: 'roles',
        meta: { title: '角色管理', icon: 'lock' }
      },
      // {
      //   path: 'jurisdictionManage',
      //   component: () => import('@/views/pages/userManage/jurisdictionManage.vue'),
      //   name: 'jurisdictionManage',
      //   meta: { title: '权限管理', icon: 'el-icon-s-cooperation' }
      // },
      
      {
        path: 'accountManage',
        component: () => import('@/views/pages/users/user.vue'),
        name: 'users',
        meta: { title: '账号管理', icon: 'peoples'}
      },
      {
        path: 'index',
        component: () => import('@/views/pages/operationLog/operationLog.vue'),
        name: 'operationLog',
        meta: { title: '操作日志管理', icon: 'el-icon-notebook-2' }
      }
    ]
  },
  {
    path: '/systemSet',
    component: Layout,
    meta: {title: '系统设置', icon: 'el-icon-s-tools'},
    children: [
      {
        path: 'equipmentParameters',
        component: () => import('@/views/pages/systemSet/equipmentParameters.vue'),
        name: 'equipmentParameters',
        meta: { title: '工作参数', icon: 'el-icon-coin' }
      },
      {
        path: 'thresholdParameters',
        component: () => import('@/views/pages/systemSet/thresholdParameters.vue'),
        name: 'thresholdParameters',
        meta: { title: '告警阈值', icon: 'el-icon-odometer' }
      },
      {
        path: 'index',
        component: () => import('@/views/pages/systemSelfTest/systemSelfTest.vue'),
        name: 'systemSelfTest',
        meta: { title: '系统自检', icon: 'el-icon-refresh' }
      },
      {
        path: 'backups',
        component: () => import('@/views/pages/systemSet/backups.vue'),
        name: 'backups',
        meta: { title: '备份', icon: 'el-icon-s-order' }
      }
    ]
  },
  // {
  //   path: '/systemSelfTest',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pages/systemSelfTest/systemSelfTest.vue'),
  //       name: 'systemSelfTest',
  //       meta: { title: '系统自检', icon: 'el-icon-refresh' }
  //     }
  //   ]
  // },
  // {
  //   path: '/alarmsHandle',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pages/alarmsHandle/alarmsHandle.vue'),
  //       name: 'alarmsHandle',
  //       meta: { title: '告警事件处理', icon: 'el-icon-coordinate' }
  //     }
  //   ]
  // },
  
  // {
  //   path: '/organizationManage',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pages/organizationManage/organizationManage.vue'),
  //       name: 'organizationManage',
  //       meta: { title: '组织机构管理', icon: 'el-icon-film' }
  //     }
  //   ]
  // },
  
  // {
  //   path: '/operationLog',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pages/operationLog/operationLog.vue'),
  //       name: 'operationLog',
  //       meta: { title: '操作日志', icon: 'el-icon-notebook-2' }
  //     }
  //   ]
  // },
  

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
