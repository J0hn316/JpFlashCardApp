<template>
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
        v-for="(word, index) in words"
        :key="index"
        :class="[
          'hover:bg-blue-50 dark:hover:bg-gray-600 transition',
          isRecentlyUpdated(word) ? 'bg-green-100 dark:bg-green-800/60' : '',
          isRecentlyAdded(word) ? 'bg-green-100 dark:bg-green-800/60 animate-pulse' : '',
          ,
        ]"
      >
        <td class="p-2 border-b text-center">{{ word.English }}</td>
        <td class="p-2 border-b text-center">{{ word.JP.Japanese }}</td>
        <td class="p-2 border-b text-center">{{ word.JP.Romaji }}</td>
        <td class="p-2 border-b text-center">{{ word.Unit }}</td>
        <td class="p-2 border-b text-center">
          <!-- ✅ Edit Button -->
          <button
            @click="$emit('edit', word)"
            class="text-sm bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded"
          >
            ✏️ Edit
          </button>
          <!-- ❌ Delete Button -->
          <button
            @click="$emit('delete', word)"
            class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2"
          >
            🗑️ Delete
          </button>
          <!-- ✅ Saved Status -->
          <Transition name="fade-saved">
            <div v-if="isRecentlyUpdated(word)">
              <span class="text-green-600 text-sm font-medium inline-block mt-1 animate-pulse">
                ✔️ Saved!
              </span>
            </div>
          </Transition>
        </td>
      </tr>
    </TransitionGroup>
  </table>
</template>

<script setup>
const props = defineProps({
  words: Array,
  isRecentlyUpdated: String,
  isRecentlyAdded: String,
})

defineEmits(['edit', 'delete'])

const isRecentlyUpdated = (word) => {
  return props.recentlyUpdatedKey === `${word.English}-${word.Unit}`
}

const isRecentlyAdded = (word) => {
  return props.recentlyAddedKey === `${word.English}-${word.Unit}`
}
</script>
