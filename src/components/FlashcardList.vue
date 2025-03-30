<template>
  <div class="p-4 space-y-4">
    <div class="score-panel bg-gray-100 p-4 rounded shadow">
      <p class="font-semibold">Score</p>
      <p>✅ Correct: {{ correctCount }}</p>
      <p>❌ Missed: {{ missedCount }}</p>
    </div>
    <div class="flashcard-list">
      <Flashcard
        v-for="(word, index) in words"
        :key="index"
        :word="word"
        @correct="handleCorrect"
        @incorrect="handleIncorrect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

const handleCorrect = () => {
  correctCount.value++
}

const handleIncorrect = () => {
  missedCount.value++
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
