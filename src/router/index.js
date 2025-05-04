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

// Global guard
router.beforeEach(async (to, from, next) => {
  // check for token in local storage
  const token = localStorage.getItem('apiToken')

  if (to.meta.requiresAuth) {
    if (!token) {
      // Not logged in, redirect to login
      return next({ name: 'Login' })
    }

    if (!store.state.auth.user) {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error()

        const user = await res.json()
        store.commit('auth/SET_USER', user)
      } catch {
        // Invalid token: clear it and redirect
        localStorage.removeItem('apiToken')
        return next({ name: 'Login' })
      }
    }
  }
  // No auth required, or token/user is valid
  next()
})

export default router
