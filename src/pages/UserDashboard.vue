<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="bg-white p-6 rounded shadow-md w-80 text-blue-500">
      <h1 class="text-2xl mb-4">Dashboard Page</h1>
      <p>Welcome {{ user.name }}</p>
      <p>High Score: {{ score }}</p>
      <RouterLink to="/quiz">Quiz Page</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { RouterLink } from 'vue-router'

const store = useStore()
const user = computed(() => store.state.auth.user)
const score = computed(() => store.state.quiz.score)
</script>
