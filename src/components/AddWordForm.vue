<template>
  <Transition name="fade-slide" appear>
    <div
      v-if="visible"
      class="mb-6 p-4 bg-white border rounded shadow dark:bg-gray-700 dark:border-gray-600 transition"
    >
      <h3 class="text-lg font-semibold mb-2 dark:text-white">Add New Word</h3>

      <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <label class="block text-sm font-medium dark:text-gray-300">English</label>
          <input
            v-model="form.English"
            type="text"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.English" class="text-sm text-red-600 mt-1">{{ errors.English }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium dark:text-gray-300">Unit</label>
          <select
            v-model="form.Unit"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          >
            <option disabled value="">-- Select a unit --</option>
            <option v-for="unit in props.availableUnits" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
          <p v-if="errors.Unit" class="text-sm text-red-600 mt-1">{{ errors.Unit }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium dark:text-gray-300">Japanese</label>
          <input
            v-model="form.JP.Japanese"
            type="text"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.Japanese" class="text-sm text-red-600 mt-1">{{ errors.Japanese }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium dark:text-gray-300">Romaji</label>
          <input
            v-model="form.JP.Romaji"
            type="text"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.Romaji" class="text-sm text-red-600 mt-1">{{ errors.Romaji }}</p>
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
  selectedUnit: String,
  availableUnits: Array,
})
const emit = defineEmits(['submit', 'cancel'])
const errors = ref({})

const form = ref({
  English: '',
  Unit: '',
  JP: {
    Japanese: '',
    Romaji: '',
  },
})

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      form.value.Unit = props.selectedUnit || ''
      errors.value = {}
    } else {
      reset()
    }
  },
)

const validate = () => {
  errors.value = {}
  if (!form.value.English.trim()) errors.value.English = 'Required'
  if (!form.value.Unit.trim()) errors.value.Unit = 'Required'
  if (!form.value.JP.Japanese.trim()) errors.value.Japanese = 'Required'
  if (!form.value.JP.Romaji.trim()) errors.value.Romaji = 'Required'
  return Object.keys(errors.value).length === 0
}

const submit = () => {
  if (!validate()) return
  emit('submit', { ...form.value }) // send form data up
  reset()
}

const reset = () => {
  form.value = {
    English: '',
    Unit: '',
    JP: {
      Japanese: '',
      Romaji: '',
    },
  }
  errors.value = {}
}
</script>
