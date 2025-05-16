<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-2">Choose a Unit</h2>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="u in availableUnits"
        :key="u"
        @click="selectUnit(u)"
        :class="[
          'px-4 py-2 rounded',
          u === modelValue ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600',
        ]"
      >
        {{ u }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue'])
const availableUnits = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('/units')

    availableUnits.value = data.map((u) => u.trim()).filter(Boolean)
  } catch (error) {
    console.error('Failed to fetch units', error)
  }
})

const selectUnit = (u) => {
  emit('update:modelValue', u)
}
</script>
