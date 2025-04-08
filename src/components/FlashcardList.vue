<template>
  <div class="p-4 space-y-4">
    <div class="score-panel bg-gray-100 p-4 rounded shadow">
      <p class="font-semibold">Score</p>
      <p>✅ Correct: {{ correctCount }}</p>
      <p>❌ Missed: {{ missedCount }}</p>
    </div>

    <div class="flashcard-list flex justify-center">
      <Flashcard
        v-if="currentCard && !quizComplete"
        :word="currentCard"
        @correct="handleCorrect"
        @incorrect="handleIncorrect"
      />
    </div>
    <div v-if="quizComplete" class="mt-6 text-center">
      <h2 class="text-xl font-bold text-green-600 mb-2">You have completed the quiz!</h2>
      <p>You got {{ correctCount }} correct and {{ missedCount }} incorrect.</p>
      <div v-if="missedWords.length > 0" class="mt-4">
        <h3 class="font-semibold mb-2">❌ Missed Words:</h3>
        <ul class="list-disc list-inside text-red-600">
          <li v-for="(word, index) in missedWords" :key="index">
            {{ word.JP.Japanese }} ({{ word.English }})
          </li>
        </ul>
      </div>
      <!-- Play Again Button -->
      <button
        @click="retryQuiz"
        class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Play Again? 🤔
      </button>
    </div>
    <button
      @click="goToDashboard"
      class="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Go to Dashboard
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Flashcard from './FlashCard.vue'

const store = useStore()
const router = useRouter()

// Score tracking
const correctCount = ref(0)
const missedCount = ref(0)
const missedWords = ref([])
const currentIndex = ref(0)
const quizComplete = ref(false)

const currentUnit = computed(() => store.state.words.currentUnit)

const words = computed(() => {
  if (!currentUnit.value) return []
  return store.getters['words/getWordsByUnit'](currentUnit.value)
})

const currentCard = computed(() => {
  return words.value[currentIndex.value] || null
})

// Handlers to process answers and move to the next card
const handleCorrect = () => {
  correctCount.value++
  store.dispatch('quiz/submitAnswer', true)
  nextCard()
}

const handleIncorrect = () => {
  missedCount.value++
  store.dispatch('quiz/submitAnswer', false)
  if (currentCard.value) {
    missedWords.value.push(currentCard.value)
  }
  nextCard()
}

const nextCard = () => {
  if (currentIndex.value < words.value.length - 1) {
    currentIndex.value++
  } else {
    quizComplete.value = true
    store.dispatch('quiz/saveHighScore')
  }
}

const retryQuiz = () => {
  correctCount.value = 0
  missedCount.value = 0
  missedWords.value = []
  currentIndex.value = 0
  quizComplete.value = false
  store.dispatch('quiz/resetQuiz')
}

// Watch for unit change to reset quiz state
watch(currentUnit, () => {
  correctCount.value = 0
  missedCount.value = 0
  currentIndex.value = 0
  quizComplete.value = false
  missedWords.value = []
  store.dispatch('quiz/resetQuiz')
})

// Save high score when quiz is complete
watch(quizComplete, (newVal) => {
  if (newVal) {
    store.dispatch('quiz/saveHighScore')
  }
})

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.flashcard-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
