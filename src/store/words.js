import words from '../assets/json/jpwordlist.json'

export default {
  namespaced: true,
  state: () => ({
    wordList: words,
    missedWords: [],
  }),
  mutations: {
    ADD_WORD(state, word) {
      state.wordList.push(word)
    },
    REMOVE_WORD(state, id) {
      state.wordList.splice(id, 1)
    },
    ADD_MISSED(state, word) {
      state.missedWords.push(word)
    },
  },
  actions: {
    fetchWords() {
      // could use axios if using API
      console.log('Test')
    },
  },
}
