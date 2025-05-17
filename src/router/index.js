import { createRouter, createWebHistory } from 'vue-router'

// Pages
import Login from '@/pages/LoginPage.vue'
import Register from '@/pages/RegisterPage.vue'
import NotFound from '@/pages/NotFoundPage.vue'
import Dashboard from '@/pages/DashboardPage.vue'
import ManageWords from '@/pages/ManageWordsPage.vue'
import FlashcardQuiz from '@/pages/FlashcardQuizPage.vue'

// View
import History from '@/views/QuizHistory.vue'

import store from '@/store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Register',
      component: Register,
    },
    {
      path: '/register',
      name: 'RegisterPage',
      component: Register,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/quiz',
      name: 'Quiz',
      component: FlashcardQuiz,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/history',
      name: 'History',
      component: History,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/manage-words',
      name: 'Manage-words',
      component: ManageWords,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/:notfound(.*)',
      name: 'Notfound',
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
