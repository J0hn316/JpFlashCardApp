<template>
  <GlobalLayout>
    <div
      class="p-4 max-w-4xl mx-auto bg-gray-300 dark:bg-gray-900 text-black dark:text-white min-h-screen"
    >
      <h1 class="text-2xl font-bold mb-4">Flashcard Quiz</h1>
      <!-- Unit Selector -->
      <UnitSelector v-model="unit" />

      <p v-if="!unit" class="mt-4 text-black dark:text-white">
        Please select a unit to start the quiz.
      </p>

      <!-- Loading spinner -->
      <div v-else-if="isLoading" class="mt-4 text-center">Loading words</div>

      <p v-else-if="!words.length">No words found for unit {{ unit }}</p>
      <!-- Flashcard List -->
      <FlashcardList v-else :words="words" :unit="unit" @complete="goToDashboard" />
    </div>
  </GlobalLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import GlobalLayout from '@/layout/GlobalLayout.vue'
import FlashcardList from '@/components/FlashcardList.vue'
import UnitSelector from '@/components/UnitSelector.vue'

const unit = ref('')
const words = ref([])
const isLoading = ref(false)
const router = useRouter()

watch(
  unit,
  async (newUnit) => {
    if (!newUnit) return

    isLoading.value = true

    try {
      const { data } = await axios.get(`/words/${newUnit}`, {
        params: {
          per_page: 1000,
        },
      })
      words.value = data.data
    } catch (error) {
      console.error('Failed to load words for quiz', error)
    } finally {
      isLoading.value = false
    }
  },
  { immediate: true },
)

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>
