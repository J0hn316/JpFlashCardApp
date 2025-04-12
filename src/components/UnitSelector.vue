<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-2">Choose a Unit</h2>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="unit in availableUnits"
        :key="unit"
        @click="selectUnit(unit)"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {{ unit }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// Get a list of unique units from allWords
const availableUnits = computed(() => {
  const units = store.state.words.allWords
    .map((word) => word.Unit.trim())
    .filter((unit) => unit !== '') // Remove empty blanks
  return [...new Set(units)] // Remove duplicates
})

// When a unit is selected, set it in the Vuex Store
const selectUnit = (unit) => {
  store.commit('words/setCurrentUnit', unit)
}
</script>
