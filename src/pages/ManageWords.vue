<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <h1 class="text-2xl font-bold text-blue-600 mb-4">Manage Words</h1>

      <!-- Unit Selector -->
      <div class="mb-4">
        <label for="unitSelect" class="block text-sm font-semibold text-gray-700 mb-1">
          Select a unit:
        </label>
        <select
          id="unitSelect"
          v-model="selectedUnit"
          @change="setUnit"
          class="w-full border px-3 py-2 rounded shadow-sm"
        >
          <option disabled value="">-- Select a unit --</option>
          <option v-for="unit in availableUnits" :key="unit" :value="unit">
            {{ unit }}
          </option>
        </select>
      </div>

      <!-- Words Table -->
      <table class="w-full text-left border-collapse table-auto">
        <thead>
          <tr class="bg-blue-100 text-blue-800">
            <th class="p-2 border-b">English</th>
            <th class="p-2 border-b">Japanese</th>
            <th class="p-2 border-b">Romaji</th>
            <th class="p-2 border-b">Unit</th>
            <th class="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(word, index) in paginatedWords"
            :key="index"
            class="hover:bg-blue-50 transition"
          >
            <td class="p-2 border-b">{{ word.English }}</td>
            <td class="p-2 border-b">{{ word.JP.Japanese }}</td>
            <td class="p-2 border-b">{{ word.JP.Romaji }}</td>
            <td class="p-2 border-b">{{ word.Unit }}</td>
            <td class="p-2 border-b">
              <button
                @click="editWord(word)"
                class="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
              >
                ✏️ Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="mt-4 flex justify-between items-center">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          ← Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      <!-- Edit Word Form -->
      <div v-if="wordBeingEdited" ref="editSection" class="mt-6 p-4 bg-white border rounded shadow">
        <h3 class="text-lg font-semibold mb-2">Editing Word</h3>

        <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium">English</label>
            <input v-model="editForm.English" type="text" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium">Unit</label>
            <input v-model="editForm.Unit" type="text" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium">Japanese</label>
            <input v-model="editForm.JP.Japanese" type="text" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium">Romaji</label>
            <input v-model="editForm.JP.Romaji" type="text" class="w-full border p-2 rounded" />
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            @click="saveWord"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            💾 Save
          </button>
          <button
            @click="cancelEdit"
            class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useToast } from 'vue-toastification'
import { useStore } from 'vuex'

const store = useStore()
const toast = useToast()

// Track selected unit from dropdown
const selectedUnit = ref(null)

// Generate unit list from all words
const availableUnits = computed(() => {
  const units = store.state.words.allWords.map((word) => word.Unit.trim())
  return [...new Set(units)]
})

// Update selected unit in store
const setUnit = () => {
  store.commit('words/setCurrentUnit', selectedUnit.value)
  currentPage.value = 1 // Reset page to 1, reset pagination on unit change
}

// Auto-select first unit on mount
onMounted(() => {
  if (availableUnits.value.length > 0) {
    selectedUnit.value = availableUnits.value[0]
    store.commit('words/setCurrentUnit', selectedUnit.value)
  }
})

// Track selected unit from store (used for filtering)
const currentUnit = computed(() => store.state.words.currentUnit)

// Pull filtered words from store
const allWords = computed(() => {
  if (!currentUnit.value) return []
  return store.getters['words/getWordsByUnit'](currentUnit.value)
})

// Pagination logic
const currentPage = ref(1)
const wordsPerPage = 10
const totalPages = computed(() => Math.ceil(allWords.value.length / wordsPerPage))

const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * wordsPerPage
  return allWords.value.slice(start, start + wordsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Editing logic
const wordBeingEdited = ref(null)
const editSection = ref(null)

const editForm = ref({
  English: '',
  Unit: '',
  JP: {
    Japanese: '',
    Romaji: '',
  },
})

const editWord = (word) => {
  wordBeingEdited.value = word

  // Pre-fill form
  editForm.value = {
    English: word.English,
    Unit: word.Unit,
    JP: {
      Japanese: word.JP.Japanese,
      Romaji: word.JP.Romaji,
    },
  }
  // Wait for DOM to update, then scroll
  nextTick(() => {
    if (editSection.value) {
      editSection.value?.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const cancelEdit = () => {
  wordBeingEdited.value = null
}

const saveWord = () => {
  const updated = {
    originalEnglish: wordBeingEdited.value.English,
    originalUnit: wordBeingEdited.value.Unit,
    ...editForm.value,
  }

  store.commit('words/updateWord', updated)
  wordBeingEdited.value = null

  toast.success('Word updated successfully!')
}
</script>
