<template>
  <nav class="bg-blue-700 text-white px-4 py-3 flex justify-between items-center">
    <div class="text-lg font-semibold">JpFlashCard</div>
    <div class="space-x-4">
      <RouterLink to="/dashboard" class="hover:underline">Dashboard</RouterLink>
      <RouterLink to="/manage-words" class="hover:underline">Manage</RouterLink>
      <RouterLink to="/quiz" class="hover:underline">Quiz</RouterLink>
      <RouterLink to="/history" class="hover:underline">History</RouterLink>
      <button
        @click="isDark = !isDark"
        class="px-3 py-1 rounded border dark:border-gray-400 border-gray-800 text-sm"
      >
        {{ isDark ? '🌙 Dark Mode' : '☀️ Light Mode' }}
      </button>
      <button @click="logout" class="hover:underline">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter, RouterLink } from 'vue-router'
import { useDarkMode } from '@/utils/UseDarkMode'

const store = useStore()
const router = useRouter()
const { isDark } = useDarkMode()

const logout = () => {
  store.dispatch('auth/logout')
  router.push('/')
}
</script>
