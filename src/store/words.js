import wordData from '@/assets/json/newJPWordList.json'

export default {
  namespaced: true,
  state: () => ({
    allWords: wordData,
    currentUnit: null,
  }),
  getters: {
    getWordsByUnit: (state) => (unit) => {
      if (!unit) return []
      return state.allWords.filter((word) => word.Unit.trim() === unit.trim())
    },
  },
  mutations: {
    setCurrentUnit(state, unit) {
      state.currentUnit = unit
    },
  },
}
