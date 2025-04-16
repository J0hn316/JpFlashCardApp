# 📘 JPFlashcard — Frontend

**JPFlashcard** is a vocabulary learning app designed to help users study Japanese words using a flashcard quiz system. The frontend is built with **Vue 3 + Vuex + TailwindCSS**, and includes features like dark mode, editable word management, and high score tracking.

---

## 🌟 Features

- ✅ User login and dashboard
- 📚 Flashcard quizzes by category/unit
- 💯 Score tracking + high score storage
- ❌ Missed words review
- ✏️ Full CRUD word management (add/edit/delete)
- 🌒 Dark mode toggle
- 🎨 Smooth transitions and clean UI
- 🔐 Route protection (requires login)
- 📱 Responsive design

---

## 🧱 Stack

- **Vue 3 (Composition API)**
- **Vuex** — for centralized state management
- **Vue Router** — for navigation
- **TailwindCSS** — for styling and dark mode
- **Vue Toastification** — for notifications

---

## 🔧 Project Structure

```
src/
├── components/
│   ├── AddWordForm.vue
│   ├── EditWordForm.vue
│   ├── PaginationControls.vue
│   ├── UnitSelectorForManage.vue
│   └── WordsTable.vue
├── layout/
│   └── GlobalLayout.vue
├── utils/
│   └── useDarkMode.js
├── views/
│   ├── FlashcardQuiz.vue
│   ├── ManageWords.vue
│   ├── NotFound.vue
│   ├── UserDashboard.vue
│   └── UserLogin.vue
├── App.vue
├── main.js
├── router.js
└── store.js
```

---

## 🚀 Project Setup

```bash
npm install
npm run dev

npm run build
```

### Lint with [ESLint](https://eslint.org/)
