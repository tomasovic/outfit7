import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Default from '@/layouts/default/Default.vue'
import useUserStore from '@/store/user'
import Events from '@/views/Events.vue'
import EventForm from '@/components/EventForm.vue'

const routes = [
  {name: 'home', path: '/', component: Home},
  {name: 'login', path: '/login', component: Login},
  {name: 'register', path: '/register', component: Register},
  {
    path: '/',
    component: Default,
    meta: {
      requiresAuth: true
    },
    children: [
      {name: 'dashboard', path: '/dashboard', component: () => import('@/views/Dashboard.vue')},
      {name: 'events', path: '/events', component: Events},
      {name: 'event', path: '/events/:id', component: EventForm},
      {name: 'create-event', path: '/events/create', component: EventForm},
      {name: 'edit-event', path: '/events/:id/edit', component: EventForm.vue},
      {name: 'profile', path: '/profile', component: () => import('@/views/Profile.vue')},
    ],
  },
  {
    path: '/:catchAll(.*)*',
    redirect: {name: 'home'}
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkExactActiveClass: 'yellow',
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const store = useUserStore()
  if (store.userLoggedIn) {
    next()
    return
  }

  try {
    await store.whoami()
    next()
  } catch (err) {
    next({name: 'login'})
  }
})


export default router
