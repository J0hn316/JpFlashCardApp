<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Flashcard Quiz</h1>
    <UnitSelector />
    <div v-if="currentUnit">
      <FlashcardList v-if="words.length" />
      <p v-else>No words found for unit {{ currentUnit }}</p>
    </div>
    <div v-else>
      <p class="mt-4 text-gray-600">Please select a unit to start the quiz.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import FlashcardList from '@/components/FlashcardList.vue'
import UnitSelector from '@/components/UnitSelector.vue'

const store = useStore()

const currentUnit = computed(() => store.state.words.currentUnit)

// Get words based on the unit using the getter
const words = computed(() => {
  if (!currentUnit.value) return []
  return store.getters['words/getWordsByUnit'](currentUnit.value)
})
</script>
