import { createRouter, createWebHistory } from 'vue-router'

import UserLogin from '@/pages/UserLogin.vue'
import UserDashboard from '@/pages/UserDashboard.vue'
import FlashcardQuiz from '@/pages/FlashcardQuiz.vue'
import ManageWords from '@/pages/ManageWords.vue'
import NotFound from '@/pages/NotFound.vue'

import store from '@/store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: UserLogin,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: UserDashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: FlashcardQuiz,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/manage-words',
      name: 'manage-words',
      component: ManageWords,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/:notfound(.*)',
      name: 'notfound',
      component: NotFound,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!store.state.auth.user

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Not logged in but trying to access a protected page
    return next('/')
  }
  // Otherwise allow navigation
  next()
})

export default router
