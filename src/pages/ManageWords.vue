<template>
  <GlobalLayout>
    <div class="min-h-screen p-6 dark:bg-gray-900 transition-colors">
      <div
        class="max-w-5xl mx-auto p-6 bg-gray-400 dark:bg-gray-800 rounded shadow transition-colors"
      >
        <h1 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-300">Manage Words</h1>
        <!-- Unit Selector -->
        <UnitSelectorForManage
          :selectedUnit="selectedUnit"
          :availableUnits="availableUnits"
          @update:selectedUnit="handleUnitChange"
        />
        <!-- Loading Spinner -->
        <div v-if="isLoading" class="flex justify-center items-center p-4">
          <div
            class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>
        <!-- Toggle Add Form Button -->
        <button
          @click="showAddForm = !showAddForm"
          class="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {{ showAddForm ? '➖ Cancel Add' : '➕ Add New Word' }}
        </button>
        <!-- Add Word Form -->
        <AddWordForm
          :visible="showAddForm"
          :selectedUnit="selectedUnit"
          :availableUnits="availableUnits"
          @submit="handleAddWord"
          @cancel="cancelNewWord"
        />

        <!-- Words Table -->
        <WordsTable
          :words="paginatedWords"
          :recentlyAddedKey="recentlyAdded"
          :recentlyUpdatedKey="recentlyUpdated"
          @edit="editWord"
          @delete="deleteWord"
        />
        <PaginationControls
          :currentPage="currentPage"
          :totalPages="totalPages"
          @prev="prevPage"
          @next="nextPage"
        />
        <!-- Edit Word Form -->
        <EditWordForm
          v-if="wordBeingEdited"
          :word="wordBeingEdited"
          @submit="handleEditSave"
          @cancel="cancelEdit"
        />
      </div>
    </div>
  </GlobalLayout>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'

// Global Layout
import GlobalLayout from '@/layout/GlobalLayout.vue'

// Components
import WordsTable from '@/components/WordsTable.vue'
import AddWordForm from '@/components/AddWordForm.vue'
import EditWordForm from '@/components/EditWordForm.vue'
import PaginationControls from '@/components/PaginationControls.vue'
import UnitSelectorForManage from '@/components/UnitSelectorForManage.vue'

const store = useStore()
const toast = useToast()
const isLoading = ref(false)
const recentlyAdded = ref(null)
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

const handleUnitChange = (unit) => {
  selectedUnit.value = unit
  setUnit()
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
const showAddForm = ref(false)

const handleAddWord = (newWord) => {
  const cleanedWord = {
    English: newWord.English.trim(),
    Unit: newWord.Unit.trim(),
    JP: {
      Japanese: newWord.JP.Japanese.trim(),
      Romaji: newWord.JP.Romaji.trim(),
    },
  }

  store.commit('words/addWord', cleanedWord)

  recentlyAdded.value = `${cleanedWord.English}-${cleanedWord.Unit}`
  toast.success(`✅ "${cleanedWord.English}" added successfully!`)
  showAddForm.value = false
  currentPage.value = totalPages.value

  setTimeout(() => {
    recentlyAdded.value = null
  }, 3000)
}

const cancelNewWord = () => {
  showAddForm.value = false
}

const editWord = async (word) => {
  wordBeingEdited.value = word
}

const cancelEdit = () => {
  wordBeingEdited.value = null
}

const handleEditSave = (updatedFields) => {
  const updated = {
    originalEnglish: wordBeingEdited.value.English,
    originalUnit: wordBeingEdited.value.Unit,
    ...updatedFields,
  }

  store.commit('words/updateWord', updated)

  recentlyUpdated.value = `${updatedFields.English}-${updatedFields.Unit}`

  setTimeout(() => {
    recentlyUpdated.value = null
  }, 3000)

  toast.success('Word updated successfully!')
  wordBeingEdited.value = null
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
.animate-pulse {
  animation: pulseFade 0.8s ease-in-out 2;
}

@keyframes pulseFade {
  0% {
    background-color: rgba(34, 197, 94, 0.3);
  }
  50% {
    background-color: rgba(34, 197, 94, 0.6);
  }
  100% {
    background-color: transparent;
  }
}
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
