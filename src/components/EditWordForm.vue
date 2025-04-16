<template>
  <Transition name="fade-slide" appear>
    <div
      ref="formRef"
      class="mt-6 p-4 bg-white border rounded shadow transition dark:bg-gray-700 dark:border-gray-600"
    >
      <h3 class="text-lg font-semibold mb-2 dark:text-white">Editing Word</h3>
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
          <input
            v-model="form.Unit"
            type="text"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.Unit" class="text-sm text-red-600 mt-1">{{ errors.Unit }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium dark:text-gray-300">Japanese</label>
          <input
            v-model="form.JP.Japanese"
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
            v-model="form.JP.Romaji"
            type="text"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.Romaji" class="text-sm text-red-600 mt-1">{{ errors.Romaji }}</p>
        </div>
      </div>
      <!-- Buttons -->
      <div class="mt-4 flex gap-2">
        <button
          @click="submit"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          💾 Save
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
import { ref, watch, defineProps, defineEmits, nextTick } from 'vue'

const props = defineProps({
  visible: Boolean,
  word: Object,
})

const errors = ref({})
const formRef = ref(null)

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  English: '',
  Unit: '',
  JP: { Japanese: '', Romaji: '' },
})

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
  emit('submit', { ...form.value })
}

// Reset form when a new word is passed in
watch(
  () => props.word,
  (newWord) => {
    if (newWord) {
      form.value = {
        English: newWord.English,
        Unit: newWord.Unit,
        JP: {
          Japanese: newWord.JP.Japanese,
          Romaji: newWord.JP.Romaji,
        },
      }
      errors.value = {}
    }
  },
  { immediate: true },
)

watch(
  () => props.word,
  async (newWord) => {
    if (newWord) {
      form.value = {
        English: newWord.English,
        Unit: newWord.Unit,
        JP: {
          Japanese: newWord.JP.Japanese,
          Romaji: newWord.JP.Romaji,
        },
      }
      errors.value = {}

      await nextTick()
      formRef.value?.scrollIntoView({ behavior: 'smooth' })
    }
  },
  { immediate: true },
)
</script>
