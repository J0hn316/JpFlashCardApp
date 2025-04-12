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
    updateWord(state, updatedWord) {
      const index = state.allWords.findIndex(
        (word) =>
          word.English === updatedWord.originalEnglish &&
          word.Unit.trim() === updatedWord.originalUnit.trim(),
      )

      if (index !== -1) {
        state.allWords[index] = {
          English: updatedWord.English,
          Unit: updatedWord.Unit,
          JP: {
            Japanese: updatedWord.JP.Japanese,
            Romaji: updatedWord.JP.Romaji,
          },
        }
      }
    },
  },
}
