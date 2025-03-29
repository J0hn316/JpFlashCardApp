<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Flashcard v-for="(word, index) in words" :key="index" :word="word" />
  </div>
</template>

<script setup>
import Flashcard from './Flashcard.vue'

defineProps(['words'])
</script>
