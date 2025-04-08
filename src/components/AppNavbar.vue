<template>
  <nav class="bg-blue-700 text-white px-4 py-3 flex justify-between items-center">
    <div class="text-lg font-semibold">JpFlashCard</div>
    <div class="space-x-4">
      <RouterLink to="/dashboard" class="hover:underline">Dashboard</RouterLink>
      <RouterLink to="/quiz" class="hover:underline">Quiz</RouterLink>
      <RouterLink to="/manage-words" class="hover:underline">Manage</RouterLink>
      <button @click="logout" class="hover:underline">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter, RouterLink } from 'vue-router'

const store = useStore()
const router = useRouter()

const logout = () => {
  store.dispatch('auth/logout')
  router.push('/')
}
</script>
