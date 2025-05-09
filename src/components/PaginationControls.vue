<template>
  <div class="mt-4 flex justify-between items-center text-gray-800 dark:text-white">
    <button
      @click="goPrev"
      :disabled="currentPage === 1"
      class="bg-gray-300 px-4 py-2 rounded dark:bg-gray-600 disabled:opacity-50"
    >
      ← Previous
    </button>
    <span>Page {{ currentPage }} of {{ lastPage }}</span>
    <button
      @click="goNext"
      :disabled="currentPage === lastPage"
      class="bg-gray-300 px-4 py-2 rounded dark:bg-gray-600 disabled:opacity-50"
    >
      Next →
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['page-changed'])

const goPrev = () => {
  if (props.currentPage > 1) {
    emit('page-changed', props.currentPage - 1)
  }
}

const goNext = () => {
  if (props.currentPage < props.lastPage) {
    emit('page-changed', props.currentPage + 1)
  }
}
</script>
