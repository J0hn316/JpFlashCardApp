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
      <p v-else-if="quizComplete" class="text-lg font-semibold text-center text-green-600 mt-4">
        🎉 Quiz Complete! You got {{ correctCount }} correct and {{ missedCount }} wrong.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import Flashcard from './FlashCard.vue'

const store = useStore()

const currentUnit = computed(() => store.state.words.currentUnit)

const words = computed(() => {
  if (!currentUnit.value) return []
  return store.getters['words/getWordsByUnit'](currentUnit.value)
})

// Score tracking
const correctCount = ref(0)
const missedCount = ref(0)

// Track which card the user is currently on
const currentIndex = ref(0)

// Flag to track if the quiz is complete
const quizComplete = ref(false)

const currentCard = computed(() => {
  return words.value[currentIndex.value] || null
})

// Handlers to process answers and move to the next card
const handleCorrect = () => {
  correctCount.value++
  nextCard()
}

const handleIncorrect = () => {
  missedCount.value++
  nextCard()
}

const nextCard = () => {
  if (currentIndex.value < words.value.length - 1) {
    currentIndex.value++
  } else {
    quizComplete.value = true
    console.log('🎉 Quiz complete!')
  }
}

// Watch for unit change to reset quiz state
watch(currentUnit, () => {
  correctCount.value = 0
  missedCount.value = 0
  currentIndex.value = 0
  quizComplete.value = false
})
</script>

<style scoped>
.flashcard-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
