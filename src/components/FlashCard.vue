<template>
  <div class="w-64 h-40 perspective cursor-pointer" @click="toggleFlip">
    <div
      class="relative w-full h-full transition-transform duration-500 transform"
      :class="{ 'rotate-y-180': isFlipped }"
    >
      <!-- Front (Japanese side) -->
      <div
        class="absolute w-full h-full bg-white text-black rounded-lg backface-hidden flex items-center justify-center border-2 border-blue-400"
      >
        <div class="text-center">
          <p class="text-xl font-bold">{{ word.JP.Japanese }}</p>
          <p class="text-sm text-gray-500">{{ word.JP.Romaji }}</p>
        </div>
      </div>

      <!-- Back (English side) -->
      <div
        class="absolute w-full h-full bg-blue-100 text-black rounded-lg backface-hidden transform rotate-y-180 flex items-center justify-center border-2 border-blue-400"
      >
        <p class="text-xl font-semibold">{{ word.English }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  word: Object,
})

const isFlipped = ref(false)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
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
