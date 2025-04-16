<template>
  <div class="mb-4">
    <label for="unitSelect" class="block text-sm font-semibold mb-1 dark:text-white">
      Select a unit:
    </label>
    <select
      id="unitSelect"
      :value="selectedUnit"
      @change="$emit('update:selectedUnit', $event.target.value)"
      class="w-full border px-3 py-2 rounded shadow-sm dark:bg-gray-700 dark:text-white"
    >
      <option disabled value="">-- Select a unit --</option>
      <option v-for="unit in availableUnits" :key="unit" :value="unit">
        {{ unit }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  selectedUnit: String,
  availableUnits: Array,
})

defineEmits(['update:selectedUnit'])
</script>
