<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-xl font-bold">Welcome to the Japanese Flashcard Game</h1>
  </div>
  <div class="min-h-screen flex items-center justify-center dark:bg-gray-900">
    <form
      @submit.prevent="handleRegister"
      class="bg-gray-100 p-6 rounded shadow-md w-80 dark:bg-gray-800 dark:text-white"
    >
      <h2 class="text-xl mb-4">Sign up</h2>

      <input
        v-model="name"
        type="text"
        placeholder="Name"
        class="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:border-gray-600"
      />

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:border-gray-600"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:border-gray-600"
      />

      <input
        v-model="password_confirm"
        type="password"
        placeholder="Confirm Password"
        class="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600"
      />

      <button
        type="submit"
        class="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
      >
        Register
      </button>
      <p class="mt-4 text-center text-sm">
        Already have an account ?
        <router-link to="login" class="text-blue-600 hover:underline">Log in</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const router = useRouter()
const toast = useToast()
const name = ref('')
const email = ref('')
const password = ref('')
const password_confirm = ref('')

const handleRegister = async () => {
  try {
    const res = await axios.post(
      '/register',
      {
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: password_confirm.value,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )

    // Save token & redirect
    localStorage.setItem('apiToken', res.data.token)
    toast.success('Registration successful!')
    router.push('/dashboard')
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      Object.values(err.response?.data?.errors || {})
        .flat()
        .join(' ') ||
      err.message
    toast.error('Register failed: ' + msg)
    console.error(err)
  }
}
</script>
