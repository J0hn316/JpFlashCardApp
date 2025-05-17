<!-- <template>
  <GlobalLayout>
    <div class="min-h-screen flex items-center justify-center dark:bg-gray-900 transition-colors">
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96 text-blue-600 dark:text-blue-300"
      >
        <h1 class="text-2xl font-bold mb-4">Dashboard Page</h1>
        <p v-if="user">👋 Welcome, {{ user.name }}</p>
        <p v-else class="text-red-500">⚠️ No user logged in.</p>
        <div class="mt-4">
          <h2 class="font-semibold text-lg">🏆 High Scores</h2>
          <ul v-if="Object.keys(highScores).length">
            <li v-for="(score, unit) in highScores" :key="unit" class="ml-2 mt-1">
              Quiz {{ unit }}: {{ score }}
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500 dark:text-gray-400">No high scores yet!</p>
        </div>
        <button
          @click="goToQuiz"
          class="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Go to Quiz
        </button>
      </div>
    </div>
  </GlobalLayout>
</template> -->

<!-- <script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import GlobalLayout from '@/layout/GlobalLayout.vue'

const store = useStore()
const router = useRouter()
const user = computed(() => store.state.auth.user)
const highScores = computed(() => store.state.quiz.highScores)

const goToQuiz = () => {
  router.push('/quiz')
}
</script> -->

<template>
  <GlobalLayout>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>

      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 bg-white dark:bg-gray-800 rounded shadow text-center">
          <p class="text-sm">Total Quizzes</p>
          <p class="text-xl font-bold">{{ stats.total_quizzes }}</p>
        </div>
        <div class="p-4 bg-white dark:bg-gray-800 rounded shadow text-center">
          <p class="text-sm">Average Score</p>
          <p class="text-xl font-bold">{{ stats.average }}%</p>
        </div>
        <div class="p-4 bg-white dark:bg-gray-800 rounded shadow text-center">
          <p class="text-sm">Best Score</p>
          <p class="text-xl font-bold">{{ stats.best }}%</p>
        </div>
      </div>
    </div>
  </GlobalLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import GlobalLayout from '@/layout/GlobalLayout.vue'

const stats = ref({
  total_quizzes: 0,
  average: 0,
  best: 0,
})

onMounted(async () => {
  try {
    const { data } = await axios.get('/quiz-results/summary')
    stats.value = data
  } catch (error) {
    console.error('Failed to load stats', error)
  }
})
</script>
