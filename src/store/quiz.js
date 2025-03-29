export default {
  namespaced: true,
  state: () => ({
    score: 0,
    totalQuestions: 0,
  }),
  mutations: {
    INCREMENT_SCORE(state) {
      state.score++
    },
    INCREMENT_TOTAL_QUESTIONS(state) {
      state.totalQuestions++
    },
    RESET_QUIZ(state) {
      state.score = 0
      state.totalQuestions = 0
    },
  },
  actions: {
    submitAnswer({ commit }, isCorrect) {
      commit('INCREMENT_TOTAL_QUESTIONS')
      if (isCorrect) {
        commit('INCREMENT_SCORE')
      }
    },
    resetQuiz({ commit }) {
      commit('RESET_QUIZ')
    },
  },
}
