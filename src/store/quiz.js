export default {
  namespaced: true,
  state: () => ({
    score: 0,
    totalQuestions: 0,
    highScores: {},
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
    SAVE_HIGH_SCORE(state, { unit, user, scorePercent }) {
      if (!state.highScores[unit]) {
        state.highScores[unit] = {}
      }
      state.highScores[unit][user] = scorePercent
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
    saveHighScore({ commit, rootState, state }) {
      const unit = rootState.words.currentUnit
      const user = rootState.auth.user?.name || 'Unknown'
      if (state.totalQuestions > 0) {
        const scorePercent = Math.round((state.score / state.totalQuestions) * 100) + '%'
        commit('SAVE_HIGH_SCORE', { unit, user, scorePercent })
      }
    },
  },
}
