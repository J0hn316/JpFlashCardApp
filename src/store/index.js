import { createStore } from 'vuex'
import auth from './auth'
import words from './words'
import quiz from './quiz'

const store = createStore({
  modules: {
    auth,
    words,
    quiz,
  },
})

export default store
