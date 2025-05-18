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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'

import Flashcard from './FlashCard.vue'
import axios from 'axios'

const props = defineProps({
  words: {
    type: Array,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['complete'])
const toast = useToast()

// Quiz state
const correctCount = ref(0)
const missedCount = ref(0)
const missedWords = ref([])
const currentIndex = ref(0)
const quizComplete = ref(false)

// The current card object
const currentCard = computed(() => props.words[currentIndex.value] || null)

// Whenever the word list changes (e.g. unit changes), reset everything
watch(
  () => props.words,
  () => {
    // Reset quiz state when words change
    correctCount.value = 0
    missedCount.value = 0
    missedWords.value = []
    currentIndex.value = 0
    quizComplete.value = false
  },
)

// Handlers to process answers and move to the next card
const handleCorrect = () => {
  correctCount.value++
  nextCard()
}

const handleIncorrect = () => {
  missedCount.value++
  if (currentCard.value) missedWords.value.push(currentCard.value)
  nextCard()
}

const nextCard = () => {
  if (currentIndex.value < props.words.length - 1) {
    currentIndex.value++
  } else {
    quizComplete.value = true
  }
}

// As soon as quizComplete flips to true, POST the results
watch(
  () => quizComplete.value,
  async (isDone) => {
    if (!isDone) return

    try {
      await axios.post('/quiz-results', {
        unit: props.unit,
        score: correctCount.value,
        total_questions: props.words.length,
        missed_words: missedWords.value.map((w) => w.id), // send only the ids of the missed words
      })
      toast.success('Quiz results submitted!')
    } catch (error) {
      toast.error('Failed to submit quiz results')
      console.error(error)
    }
    //
    emit('complete')
  },
  { immediate: false },
)
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
