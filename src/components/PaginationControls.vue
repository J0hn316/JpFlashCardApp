<template>
  <div class="mt-4 flex justify-between items-center text-gray-800 dark:text-white">
    <button
      @click="$emit('prev')"
      :disabled="currentPage === 1"
      class="bg-gray-300 px-4 py-2 rounded dark:bg-gray-600 disabled:opacity-50"
    >
      ← Previous
    </button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button
      @click="$emit('next')"
      :disabled="currentPage === totalPages"
      class="bg-gray-300 px-4 py-2 rounded dark:bg-gray-600 disabled:opacity-50"
    >
      Next →
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: Number,
  totalPages: Number,
})

defineEmits(['prev', 'next'])
</script>
