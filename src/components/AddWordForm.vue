<template>
  <Transition name="fade-slide" appear>
    <div
      v-if="visible"
      class="mb-6 p-4 bg-white border rounded shadow dark:bg-gray-700 dark:border-gray-600 transition"
    >
      <h3 class="text-lg font-semibold mb-2 dark:text-white">Add New Word</h3>
      <!-- English -->
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <label class="block text-sm font-medium dark:text-gray-300">English</label>
          <input
            v-model="form.english"
            type="text"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.english" class="text-sm text-red-600 mt-1">{{ errors.english }}</p>
        </div>

        <!-- Unit -->
        <div>
          <label class="block text-sm font-medium dark:text-gray-300">Unit</label>
          <select
            v-model="form.unit"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          >
            <option disabled value="">-- Select a unit --</option>
            <option v-for="unit in props.availableUnits" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
          <p v-if="errors.unit" class="text-sm text-red-600 mt-1">{{ errors.unit }}</p>
        </div>

        <!-- Japanese -->
        <div>
          <label class="block text-sm font-medium dark:text-gray-300">Japanese</label>
          <input
            v-model="form.japanese"
            type="text"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.japanese" class="text-sm text-red-600 mt-1">{{ errors.japanese }}</p>
        </div>

        <!-- Romaji -->
        <div>
          <label class="block text-sm font-medium dark:text-gray-300">Romaji</label>
          <input
            v-model="form.romaji"
            type="text"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.romaji" class="text-sm text-red-600 mt-1">{{ errors.romaji }}</p>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="submit"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          ➕ Add Word
        </button>
        <button
          @click="$emit('cancel')"
          class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: Boolean,
  availableUnits: {
    type: Array,
    default: () => [],
  },
  initialEnglish: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['submit', 'cancel'])
const errors = ref({})

const form = ref({
  english: '',
  unit: '',
  japanese: '',
  romaji: '',
})

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      form.value.unit = props.availableUnits[0] || ''
      form.value.english = props.initialEnglish.trim() || ''
      errors.value = {}
    } else {
      reset()
    }
  },
)

const validate = () => {
  errors.value = {}
  if (!form.value.english.trim()) errors.value.english = 'Required'
  if (!form.value.unit.trim()) errors.value.unit = 'Required'
  if (!form.value.japanese.trim()) errors.value.japanese = 'Required'
  if (!form.value.romaji.trim()) errors.value.romaji = 'Required'
  return Object.keys(errors.value).length === 0
}

const submit = () => {
  if (!validate()) return
  emit('submit', {
    english: form.value.english.trim(),
    unit: form.value.unit.trim(),
    japanese: form.value.japanese.trim(),
    romaji: form.value.romaji.trim(),
  })
  reset()
}

function reset() {
  form.value = { english: '', unit: '', japanese: '', romaji: '' }
  errors.value = {}
}
</script>
