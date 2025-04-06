<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <form @submit.prevent="handleLogin" class="bg-white p-6 rounded shadow-md w-80">
      <h2 class="text-xl mb-4">Login</h2>
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="w-full p-2 border rounded"
      />
      <button class="mt-4 bg-blue-600 text-white p-2 w-full">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const username = ref('')
const store = useStore()
const router = useRouter()
const toast = useToast()

const handleLogin = async () => {
  try {
    const res = await store.dispatch('auth/login', { username: username.value })
    if (res) {
      router.push('/dashboard')
    }
  } catch (error) {
    toast.error('User name required')
    console.error(error)
  }
}
</script>
