import { createRouter, createWebHistory } from 'vue-router'

import UserLogin from '@/pages/UserLogin.vue'
import UserDashboard from '@/pages/UserDashboard.vue'
import FlashcardQuiz from '@/pages/FlashcardQuiz.vue'
import ManageWords from '@/pages/ManageWords.vue'
import NotFound from '@/pages/NotFound.vue'

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
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: FlashcardQuiz,
    },
    {
      path: '/manage-words',
      name: 'manage-words',
      component: ManageWords,
    },
    {
      path: '/:notfound(.*)',
      name: 'notfound',
      component: NotFound,
    },
  ],
})

export default router
