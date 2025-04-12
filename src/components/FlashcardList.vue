<template>
  <div class="p-4 space-y-6 max-w-3xl mx-auto">
    <!-- Score Panel -->
    <Transition name="fade-slide">
      <div v-if="!quizComplete" class="score-panel">
        <p class="font-semibold text-lg">score</p>
        <p class="text-green-600 dark:text-green-400">✅ Correct: {{ correctCount }}</p>
        <p class="text-red-500 dark:text-red-400">❌ Incorrect: {{ missedCount }}</p>
      </div>
    </Transition>

    <!-- Flashcard Display -->
    <div class="flashcard-list" v-if="!quizComplete">
      <Flashcard
        v-if="currentCard"
        :word="currentCard"
        @correct="handleCorrect"
        @incorrect="handleIncorrect"
      />
    </div>

    <!-- Quiz Complete Message -->
    <Transition name="fade-slide" appear>
      <div v-if="quizComplete" class="quiz-complete">
        <h2 class="text-xl font-bold mb-2">You've completed the quiz!</h2>
        <p class="mb-2">You got {{ correctCount }} correct and {{ missedCount }} incorrect.</p>

        <!-- Missed Words List -->
        <div v-if="missedWords.length > 0" class="mt-4 text-red-600 dark:text-red-400">
          <h3 class="font-semibold mb-2">
            <span v-if="missedWords.length === 1">You missed the following word:</span>
            <span v-else>You missed the following words:</span>
          </h3>
          <TransitionGroup name="fade-in-word" tag="ul" class="list-disc list-inside space-y-1">
            <li v-for="(word, index) in missedWords" :key="word.JP.Japanese + index">
              {{ word.JP.Japanese }} ({{ word.English }})
            </li>
          </TransitionGroup>
        </div>

        <!-- Buttons -->
        <Transition name="fade-slide" appear>
          <div class="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button
              @click="retryQuiz"
              class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Play again 🤔
            </button>
            <button
              @click="goToDashboard"
              class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
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

<style scoped lang="postcss">
.flashcard-list {
  @apply flex justify-center items-center min-h-[12rem] transition-all duration-300 ease-in-out;
}

.score-panel {
  @apply bg-gray-100 dark:bg-gray-800 dark:text-white p-4 rounded shadow text-center space-y-1;
}

.quiz-complete {
  @apply text-center text-black dark:text-white mt-8 text-base;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-in-word-enter-active {
  transition: all 0.4s ease;
}
.fade-in-word-enter-from {
  opacity: 0;
  transform: translateX(-8px);
}
.fade-in-word-enter-to {
  opacity: 1;
  transform: translateX(0);
}
</style>
