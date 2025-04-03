<template>
  <div class="w-64 h-40 perspective cursor-pointer" @click="toggleFlip">
    <div
      class="relative w-full h-full transition-transform duration-500 transform"
      :class="{ 'rotate-y-180': isFlipped }"
    >
      <!-- Front (Japanese side) -->
      <div
        class="absolute w-full h-full bg-white text-black rounded-lg backface-hidden flex flex-col items-center justify-center border-2 border-blue-400"
      >
        <div class="text-center">
          <p class="text-xl font-bold">{{ word.JP.Japanese }}</p>
          <p class="text-sm text-gray-500">{{ word.JP.Romaji }}</p>
        </div>
      </div>

      <!-- Back (English side) -->
      <div
        class="absolute w-full h-full bg-blue-100 text-black rounded-lg backface-hidden transform rotate-y-180 flex flex-col items-center justify-center border-2 border-blue-400 space-y-2"
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
import { ref, defineProps, defineEmits } from 'vue'

defineProps({
  word: Object,
})

const emit = defineEmits(['correct', 'incorrect'])

const isFlipped = ref(false)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

const autoFlipBack = () => {
  setTimeout(() => {
    isFlipped.value = false
  }, 1200) // 1.2 seconds
}

const markCorrect = () => {
  emit('correct')
  autoFlipBack()
}
const markIncorrect = () => {
  emit('incorrect')
  autoFlipBack()
}
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
