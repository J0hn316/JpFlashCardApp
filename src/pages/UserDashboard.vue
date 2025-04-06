<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="bg-white p-6 rounded shadow-md w-96 text-blue-500">
      <h1 class="text-2xl mb-4">Dashboard Page</h1>
      <p v-if="user">Welcome {{ user.name }}</p>
      <p v-else class="text-red-600">⚠️ No user logged in.</p>

      <div class="mt-4">
        <h2 class="font-semibold text-lg">🏆 High Scores</h2>
        <ul v-if="Object.keys(highScores).length">
          <li v-for="(unitScores, unit) in highScores" :key="unit" class="mb-2">
            <span class="font-bold">{{ unit }} Quiz</span>
            <ul class="pl-4 list-disc">
              <li v-for="(score, username) in unitScores" :key="username">
                {{ username }} - {{ score }}
              </li>
            </ul>
          </li>
        </ul>
        <p v-else>No high scores yet!</p>
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
