import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';

const routes = [
    {
        path: '/',
        name: 'home',
        props: true,
        component: () => import('../components/home.vue')
    },
    {
        path: '/setAppointment',
        name: 'setAppointment',
        props: true,
        component: () => import('../components/setAppointment.vue')
    },
    {
        path: '/delete',
        name: 'delete',
        component: () => import('../components/delete.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/login.vue')
    },
    {
        path: '/schedule',
        name: 'schedule',
        component: () => import('../components/schedule.vue'),
        meta: {
            requiresAuth: true,
          },
    },
    {
        path: '/reports',
        name: 'reports',
        component: () => import('../components/reports.vue'),
        meta: {
            requiresAuth: true,
          },
    },
    {
        path: '/cancelAppointment',
        name: 'cancelAppointment',
        component: () => import('../components/cancelAppointment.vue'),
    },
    {
        path: '/success/:date/:time',
        name: 'success',
        component: () => import('../components/success.vue'),
    },
    {
        path: '/changeAnnouncement',
        name: 'changeAnnouncement',
        component: () => import('../components/changeAnnouncement.vue'),
    },
]
const router = createRouter({
    history: createWebHistory(), routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.state.isLoggedIn) {
      next('/login');
    } else {
      next();
    }
  });

export default router