<template>
  <GlobalLayout>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Quiz History</h1>
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-700 text-gray-200">
            <th class="p-2">Date</th>
            <th class="p-2">User</th>
            <th class="p-2">Unit</th>
            <th class="p-2">Score</th>
            <th class="p-2">Missed Words</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="result in quizResults"
            :key="result.id"
            class="border-b border-gray-800 text-gray-100"
          >
            <td class="p-2">{{ new Date(result.created_at).toLocaleString() }}</td>
            <td class="p-2">{{ result.user.name }}</td>
            <td class="p-2">{{ result.unit }}</td>
            <td class="p-2">{{ result.score }}/{{ result.total_questions }}</td>
            <td class="p-2">{{ result.missed_words.length || 0 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </GlobalLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

import GlobalLayout from '@/layout/GlobalLayout.vue'

const quizResults = ref([])
const userName = ref('')
const toast = useToast()

onMounted(async () => {
  try {
    const [{ data: user }, { data: history }] = await Promise.all([
      axios.get('/user'),
      axios.get('/quiz-results'),
    ])

    userName.value = user.name
    quizResults.value = history
  } catch (error) {
    toast.error('Failed to load quiz history.')
    console.error('Failed to load quiz history', error)
  }
})
</script>
