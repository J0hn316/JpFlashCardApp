<template>
  <GlobalLayout>
    <div class="min-h-screen p-6 dark:bg-gray-900 transition-colors">
      <div
        class="max-w-5xl mx-auto p-6 bg-gray-400 dark:bg-gray-800 rounded shadow transition-colors"
      >
        <h1 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-300">Manage Words</h1>

        <!-- Search & Add Word Controls -->
        <div class="flex space-x-4 mb-4">
          <div class="flex-1 flex">
            <input
              v-model="search"
              @keyup.enter="fetchWords"
              type="text"
              placeholder="Enter english words here..."
              class="border rounded p-2 flex-1 dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              @click="fetchWords"
              class="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
          <button
            @click="showAddForm = !showAddForm"
            class="ml-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {{ showAddForm ? '➖ Cancel' : '➕ Add New Word' }}
          </button>
        </div>

        <!-- Add Word Form -->
        <AddWordForm
          v-if="showAddForm"
          :visible="showAddForm"
          :available-units="availableUnits"
          :initial-english="search"
          @submit="createWord"
          @cancel="() => (showAddForm = false)"
        />

        <!-- Loading Spinner -->
        <div v-if="isLoading" class="flex justify-center items-center p-4">
          <div
            class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>

        <div v-else-if="words.length > 0">
          <!-- Words Table -->
          <WordsTable
            :words="words"
            :recentlyAddedKey="recentlyAdded"
            :recentlyUpdatedKey="recentlyUpdated"
            @edit="onEdit"
            @delete="deleteWord"
          />
          <!-- Pagination -->
          <PaginationControls
            :current-page="pagination.current_page"
            :last-page="pagination.last_page"
            @page-changed="onPageChange"
            class="mt-4"
          />
        </div>

        <!-- If no results & non-empty search -->
        <div v-else-if="search.trim().length > 0 && !showAddForm" class="text-center p-6">
          <p class="mb-4 text-lg dark:text-white">
            No words found for “<strong>{{ search }}</strong
            >”.
          </p>
          <button
            @click="showAddForm = true"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ➕ Click here to add word.
          </button>
        </div>

        <!-- Edit Word Form -->
        <div v-if="editingWord" class="mt-6">
          <EditWordForm
            :word="editingWord"
            :available-units="availableUnits"
            @submit="updateWord"
            @cancel="editingWord = null"
          />
        </div>
      </div>
    </div>
  </GlobalLayout>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

// Global Layout
import GlobalLayout from '@/layout/GlobalLayout.vue'

// Components
import WordsTable from '@/components/WordsTable.vue'
import AddWordForm from '@/components/AddWordForm.vue'
import EditWordForm from '@/components/EditWordForm.vue'
import PaginationControls from '@/components/PaginationControls.vue'

const toast = useToast()

// API Setup
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('apiToken')}`

// Reactive state
const search = ref('')
const showAddForm = ref(false)
const editingWord = ref(null)
const isLoading = ref(false)
const recentlyAdded = ref(null)
const recentlyUpdated = ref(null)

// Pagination state
const pagination = reactive({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
})

// Data
const words = ref([])
const availableUnits = ref([])

// Fetch paginated & filtered words
const fetchWords = async () => {
  isLoading.value = true

  try {
    const { data } = await axios.get('/words', {
      params: {
        page: pagination.current_page,
        per_page: pagination.per_page,
        search: search.value.trim(),
      },
    })

    words.value = data.data
    pagination.current_page = data.current_page
    pagination.last_page = data.last_page
    pagination.per_page = data.per_page
    pagination.total = data.total
  } catch (error) {
    toast.error('Failed to load words')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch([search], () => {
  pagination.current_page = 1
  fetchWords()
})

// Pagination controls
const onPageChange = (page) => {
  pagination.current_page = page
  fetchWords()
}

// Add a new word
const createWord = async (wordData) => {
  try {
    const payload = {
      unit: wordData.unit,
      japanese: wordData.japanese,
      romaji: wordData.romaji,
      english: wordData.english,
    }

    const res = await axios.post('/words', payload)

    toast.success(`“${res.data.english}” added in unit “${res.data.unit}”`)

    recentlyAdded.value = `${res.data.english}-${res.data.unit}`

    showAddForm.value = false
    fetchWords()

    setTimeout(() => {
      recentlyAdded.value = null
    }, 3000)
  } catch (error) {
    toast.error('Failed to add word')
    console.error(error)
  }
}

// Edit
const onEdit = (word) => {
  editingWord.value = { ...word }
}

const updateWord = async (updated) => {
  try {
    const { data } = await axios.put(`/words/${updated.id}`, updated)

    toast.success('Word updated')
    recentlyUpdated.value = `${data.english}-${data.unit}`
    editingWord.value = null

    fetchWords()
    setTimeout(() => (recentlyUpdated.value = null), 3000)
  } catch (error) {
    toast.error('Failed to update word')
    console.error(error)
  }
}

// Delete
const deleteWord = async (word) => {
  if (!confirm(`Delete "${word.english}"?`)) return
  try {
    await axios.delete(`/words/${word.id}`)
    toast.success('Word deleted')
    fetchWords()
  } catch (error) {
    toast.error('Failed to delete word')
    console.error(error)
  }
}

// Initial Load
onMounted(async () => {
  const { data } = await axios.get('/units')
  availableUnits.value = data.map((u) => u.trim()).filter(Boolean)
  await fetchWords()
})
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
