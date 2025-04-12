<template>
  <div class="w-64 h-40 perspective cursor-pointer" @click="toggleFlip">
    <div
      class="relative w-full h-full card-animated preserve-3d"
      :class="{ 'rotate-y-180': isFlipped }"
    >
      <!-- Front (Japanese side) -->
      <div class="card-face">
        <div class="text-center">
          <p class="text-xl font-bold">{{ word.JP.Japanese }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">{{ word.JP.Romaji }}</p>
        </div>
      </div>

      <!-- Back (English side) -->
      <div
        class="card-face back-face transform rotate-y-180 bg-blue-100 text-black dark:bg-blue-900 dark:text-white"
      >
        <p class="text-xl font-semibold">{{ word.English }}</p>

        <div v-if="isFlipped" class="mt-4 flex gap-4">
          <button
            @click.stop="markCorrect"
            class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            ✅ Correct
          </button>
          <button
            @click.stop="markIncorrect"
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            ❌ Incorrect
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  word: Object,
})

const emit = defineEmits(['correct', 'incorrect'])

const isFlipped = ref(false)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

const markCorrect = () => {
  emit('correct')
  autoFlipBack()
}
const markIncorrect = () => {
  emit('incorrect')
  autoFlipBack()
}

const autoFlipBack = () => {
  setTimeout(() => {
    isFlipped.value = false
  }, 1200)
}

watch(
  () => props.word,
  () => {
    isFlipped.value = false
  },
)
</script>

<style scoped lang="postcss">
.perspective {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.transform-style {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}

/* Front of card (default style) */
.card-face {
  @apply absolute w-full h-full flex flex-col items-center justify-center rounded-lg border-2 border-blue-400 bg-white text-black;
  backface-visibility: hidden;
}

/* Back of card */
.back-face {
  @apply bg-blue-100 text-black dark:bg-blue-900 dark:text-white;
}

/* Optional: reset override in dark mode just for front face */
.dark .card-face:not(.back-face) {
  @apply bg-gray-800 text-white border-blue-300;
}

.card-animated {
  @apply transition-transform duration-500 ease-in-out;
}

.card-animated.rotate-y-180 {
  transform: rotateY(180deg) scale(1.05);
}
</style>
