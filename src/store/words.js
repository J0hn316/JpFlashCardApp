import wordData from '@/assets/json/newJPWordList.json'

export default {
  state: () => ({
    allWords: wordData,
    currentUnit: null,
  }),
  getters: {
    getWordsByUnit: (state) => (unit) => {
      return state.allWords.filter((word) => word.Unit.trim() === unit.trim())
    },
  },
  mutations: {
    setCurrentUnit(state, unit) {
      state.currentUnit = unit
    },
  },
}
