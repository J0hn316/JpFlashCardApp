<template>
  <div class="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
    <AppNavbar v-if="showNavbar" />
    <RouterView />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'

const route = useRoute()

const showNavbar = computed(() => route.path !== '/')
</script>
