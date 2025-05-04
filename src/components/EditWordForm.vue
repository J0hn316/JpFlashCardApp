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
            v-model="form.english"
            type="text"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.english" class="text-sm text-red-600 mt-1">{{ errors.english }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium dark:text-gray-300">Unit</label>
          <input
            v-model="form.unit"
            type="text"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.unit" class="text-sm text-red-600 mt-1">{{ errors.unit }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium dark:text-gray-300">Japanese</label>
          <input
            v-model="form.japanese"
            type="text"
            class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.japanese" class="text-sm text-red-600 mt-1">
            {{ errors.japanese }}
          </p>
        </div>
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
  if (!form.value.english.trim()) errors.value.english = 'Required'
  if (!form.value.unit.trim()) errors.value.unit = 'Required'
  if (!form.value.japanese.trim()) errors.value.japanese = 'Required'
  if (!form.value.romaji.trim()) errors.value.romaji = 'Required'
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
        English: newWord.english,
        Unit: newWord.unit,
        JP: {
          Japanese: newWord.japanese,
          Romaji: newWord.romaji,
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
        English: newWord.english,
        Unit: newWord.unit,
        JP: {
          Japanese: newWord.japanese,
          Romaji: newWord.romaji,
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
