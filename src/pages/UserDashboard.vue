<template>
  <div class="min-h-screen flex items-center justify-center dark:bg-gray-900 transition-colors">
    <div
      class="bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-300 p-6 rounded shadow-md w-96"
    >
      <h1 class="text-2xl mb-4">Dashboard Page</h1>
      <p v-if="user">Welcome {{ user.name }}</p>
      <p v-else class="text-red-600 dark:text-red-400">⚠️ No user logged in.</p>

      <div class="mt-4">
        <h2 class="font-semibold text-lg text-blue-600 dark:text-blue-400">🏆 High Scores</h2>
        <ul v-if="Object.keys(highScores).length">
          <li v-for="(userScores, unit) in highScores" :key="unit" class="mb-2">
            <span class="font-bold">{{ unit }} Quiz</span>
            <ul class="mt-2">
              <li v-for="(score, username) in userScores" :key="username">
                {{ username }} - {{ score }}%
              </li>
            </ul>
          </li>
        </ul>
        <p v-else class="text-gray-600 dark:text-gray-300">No high scores yet!</p>
      </div>
      <button
        @click="goToQuiz"
        class="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go to Quiz
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const user = computed(() => store.state.auth.user)
const highScores = computed(() => store.state.quiz.highScores)

const goToQuiz = () => {
  router.push('/quiz')
}
</script>
