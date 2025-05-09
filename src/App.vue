<template>
  <div
    class="min-h-screen bg-blue-500 text-slate-800 dark:bg-gray-900 dark:text-white transition-colors"
  >
    <AppNavbar v-if="showNavbar" />
    <!-- Global Layout Wrapper around RouterView -->
    <GlobalLayout>
      <RouterView />
    </GlobalLayout>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import GlobalLayout from '@/layout/GlobalLayout.vue'

const route = useRoute()

const showNavbar = computed(
  () => route.path !== '/' && route.path !== '/login' && route.path !== '/register',
)
</script>
