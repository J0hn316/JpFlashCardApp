<template>
  <div class="p-6 text-white">
    <h1 class="text-2xl mb-4">Welcome, {{ user.name }}!</h1>
    <p>High Score: {{ score }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const user = computed(() => store.state.auth.user)
const score = computed(() => store.state.quiz.score)
</script>
