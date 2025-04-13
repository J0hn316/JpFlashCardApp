<template>
  <GlobalLayout>
    <div class="min-h-screen p-6 dark:bg-gray-900 transition-colors">
      <div
        class="max-w-5xl mx-auto p-6 bg-gray-400 dark:bg-gray-800 rounded shadow transition-colors"
      >
        <h1 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-300">Manage Words</h1>
        <!-- Unit Selector -->
        <div class="mb-4">
          <label for="unitSelect" class="block text-sm font-semibold mb-1 dark:text-white">
            Select a unit:
          </label>
          <select
            id="unitSelect"
            v-model="selectedUnit"
            @change="setUnit"
            class="w-full border px-3 py-2 rounded shadow-sm dark:bg-gray-700 dark:text-white"
          >
            <option disabled value="">-- Select a unit --</option>
            <option v-for="unit in availableUnits" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
        </div>
        <!-- Loading Spinner -->
        <div v-if="isLoading" class="flex justify-center items-center p-4">
          <div
            class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>
        <!-- Words Table -->
        <table class="w-full text-left border-collapse table-auto transition-colors">
          <thead>
            <tr class="bg-blue-100 text-blue-800 dark:bg-gray-700 dark:text-blue-200">
              <th class="p-2 border-b font-bold text-center">English</th>
              <th class="p-2 border-b font-bold text-center">Japanese</th>
              <th class="p-2 border-b font-bold text-center">Romaji</th>
              <th class="p-2 border-b font-bold text-center">Unit</th>
              <th class="p-2 border-b font-bold text-center">Actions</th>
            </tr>
          </thead>
          <TransitionGroup name="fade-table" tag="tbody">
            <tr
              v-for="(word, index) in paginatedWords"
              :key="index"
              :class="[
                'hover:bg-blue-50 dark:hover:bg-gray-600',
                'transition',
                isRecentlyUpdated(word) ? 'bg-green-100 dark:bg-green-800/60' : '',
              ]"
            >
              <td class="p-2 border-b text-center">{{ word.English }}</td>
              <td class="p-2 border-b text-center">{{ word.JP.Japanese }}</td>
              <td class="p-2 border-b text-center">{{ word.JP.Romaji }}</td>
              <td class="p-2 border-b text-center">{{ word.Unit }}</td>
              <td class="p-2 border-b text-center">
                <!-- ✅ Edit Button -->
                <button
                  @click="editWord(word)"
                  class="text-sm bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded"
                >
                  ✏️ Edit
                </button>
                <!-- ❌ Delete Button -->
                <button
                  @click="deleteWord(word)"
                  class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2"
                >
                  🗑️ Delete
                </button>
                <!-- ✅ Saved Status -->
                <Transition name="fade-saved">
                  <div v-if="isRecentlyUpdated(word)">
                    <span
                      class="text-green-600 text-sm font-medium inline-block mt-1 animate-pulse"
                    >
                      ✔️ Saved!
                    </span>
                  </div>
                </Transition>
              </td>
            </tr>
          </TransitionGroup>
        </table>
        <!-- Pagination Controls -->
        <div class="mt-4 flex justify-between items-center text-gray-800 dark:text-white">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="bg-gray-300 px-4 py-2 rounded dark:bg-gray-600 disabled:opacity-50"
          >
            ← Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="bg-gray-300 px-4 py-2 rounded dark:bg-gray-600 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
        <!-- Edit Word Form -->
        <Transition name="fade-slide" appear>
          <div
            v-if="wordBeingEdited"
            ref="editSection"
            class="mt-6 p-4 bg-white border rounded shadow transition dark:bg-gray-700 dark:border-gray-600"
          >
            <h3 class="text-lg font-semibold mb-2 dark:text-white">Editing Word</h3>
            <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium dark:text-gray-300">English</label>
                <input
                  v-model="editForm.English"
                  type="text"
                  class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
                />
                <p v-if="errors.English" class="text-sm text-red-600 mt-1">{{ errors.English }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium dark:text-gray-300">Unit</label>
                <input
                  v-model="editForm.Unit"
                  type="text"
                  class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
                />
                <p v-if="errors.Unit" class="text-sm text-red-600 mt-1">{{ errors.Unit }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium dark:text-gray-300">Japanese</label>
                <input
                  v-model="editForm.JP.Japanese"
                  type="text"
                  class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
                />
                <p v-if="errors.Japanese" class="text-sm text-red-600 mt-1">
                  {{ errors.Japanese }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium dark:text-gray-300">Romaji</label>
                <input
                  v-model="editForm.JP.Romaji"
                  type="text"
                  class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
                />
                <p v-if="errors.Romaji" class="text-sm text-red-600 mt-1">{{ errors.Romaji }}</p>
              </div>
            </div>
            <!-- Buttons -->
            <div class="mt-4 flex gap-2">
              <button
                @click="saveWord"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                💾 Save
              </button>
              <button
                @click="cancelEdit"
                class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </GlobalLayout>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import GlobalLayout from '@/layout/GlobalLayout.vue'

const store = useStore()
const toast = useToast()
const isLoading = ref(false)
const recentlyUpdated = ref(null)

// Track selected unit from dropdown
const selectedUnit = ref(null)

// Generate unit list from all words
const availableUnits = computed(() => {
  const units = store.state.words.allWords.map((word) => word.Unit.trim())
  return [...new Set(units)]
})

// Update selected unit in store
const setUnit = () => {
  isLoading.value = true
  setTimeout(() => {
    store.commit('words/setCurrentUnit', selectedUnit.value)
    currentPage.value = 1 // Reset page to 1, reset pagination on unit change
    toast.success(`✅ Unit changed to: ${selectedUnit.value}`)
    isLoading.value = false
  }, 300)
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

const isRecentlyUpdated = (word) => {
  return recentlyUpdated.value === `${word.English}-${word.Unit}`
}

// Pagination logic
const currentPage = ref(1)
const wordsPerPage = 10
const totalPages = computed(() => Math.ceil(allWords.value.length / wordsPerPage))

const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * wordsPerPage
  return allWords.value.slice(start, start + wordsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    isLoading.value = true
    setTimeout(() => {
      currentPage.value++
      toast.info(`📄 Page ${currentPage.value} loaded`)
      isLoading.value = false
    }, 300)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    isLoading.value = true
    setTimeout(() => {
      currentPage.value--
      toast.info(`📄 Page ${currentPage.value} loaded`)
      isLoading.value = false
    }, 300)
  }
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

const errors = ref({})

const validateForm = () => {
  errors.value = {}

  if (!editForm.value.English.trim()) errors.value.English = 'English word is required'
  if (!editForm.value.Unit.trim()) errors.value.Unit = 'Unit is required'
  if (!editForm.value.JP.Japanese.trim()) errors.value.Japanese = 'Japanese word is required'
  if (!editForm.value.JP.Romaji.trim()) errors.value.Romaji = 'Romaji is required'

  return Object.keys(errors.value).length === 0
}

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
    editSection.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

const cancelEdit = () => {
  wordBeingEdited.value = null
  editForm.value = {
    English: '',
    Unit: '',
    JP: {
      Japanese: '',
      Romaji: '',
    },
  }
}

const saveWord = () => {
  if (!validateForm()) {
    toast.error('Please fix the validation errors before saving.')
    return
  }

  const updated = {
    originalEnglish: wordBeingEdited.value.English,
    originalUnit: wordBeingEdited.value.Unit,
    ...editForm.value,
  }

  store.commit('words/updateWord', updated)

  recentlyUpdated.value = `${editForm.value.English}-${editForm.value.Unit}`

  setTimeout(() => {
    recentlyUpdated.value = null
  }, 3000)

  toast.success('Word updated successfully!')
  wordBeingEdited.value = null
  errors.value = {}
}

const deleteWord = (word) => {
  const confirmDelete = confirm(`Are you sure you want to delete "${word.English}"?`)

  if (confirmDelete) {
    isLoading.value = true
    setTimeout(() => {
      store.commit('words/deleteWord', {
        English: word.English,
        Unit: word.Unit,
      })
      toast.success(`"${word.English}" was deleted successfully.`)
      if (
        wordBeingEdited.value &&
        wordBeingEdited.value.English === word.English &&
        wordBeingEdited.value.Unit === word.Unit
      ) {
        cancelEdit()
      }
      isLoading.value = false
    }, 300)
  }
}
</script>

<style scoped lang="postcss">
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-table-enter-active,
.fade-table-leave-active {
  transition: all 0.35s ease;
}
.fade-table-enter-from,
.fade-table-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.fade-table-enter-to,
.fade-table-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-saved-enter-active,
.fade-saved-leave-active {
  transition: opacity 0.3s ease;
}

.fade-saved-enter-from,
.fade-saved-leave-to {
  opacity: 0;
}

.fade-saved-enter-to,
.fade-saved-leave-from {
  opacity: 1;
}
</style>
