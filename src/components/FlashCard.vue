<template>
  <div class="card" @click="flipped = !flipped" :class="{ flipped }">
    <p v-if="!flipped">
      {{ word.JP.Japanese }}
    </p>
    <p v-else>
      {{ word.English }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps(['word'])

const flipped = ref(false)
</script>

<style scoped>
.card {
  @apply w-full p-4 rounded-xl shadow-md bg-white text-center transition-transform duration-300 cursor-pointer;
}
.flipped {
  transform: rotateY(180deg);
}
</style>
