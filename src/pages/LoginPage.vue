<template>
  <div class="min-h-screen flex items-center justify-center dark:bg-gray-900 transition-colors">
    <form
      @submit.prevent="handleLogin"
      class="bg-white p-6 rounded shadow-md w-80 dark:bg-gray-800 dark:text-white"
    >
      <h2 class="text-xl mb-4">Login</h2>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full p-2 mt-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />

      <button
        type="submit"
        class="mt-4 bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
      <p class="mt-4 text-sm">
        Don't have an account ?
        <router-link to="/register" class="text-blue-600 hover:underline ml-1">
          Sign up
        </router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const email = ref('')
const password = ref('')
const router = useRouter()
const toast = useToast()

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const handleLogin = async () => {
  try {
    const res = await axios.post(
      '/login',
      { email: email.value, password: password.value },
      { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } },
    )

    localStorage.setItem('apiToken', res.data.token)
    router.push('/dashboard')
  } catch (err) {
    toast.error('Incorrect email or password')
    console.error(err)
  }
}
</script>
