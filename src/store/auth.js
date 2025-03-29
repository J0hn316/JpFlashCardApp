export default {
  namespace: true,
  state: () => ({
    user: null,
  }),
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    LOGOUT(state) {
      state.user = null
    },
  },
  actions: {
    login({ commit }, { username }) {
      if (!username) {
        throw new Error('Username is required')
      }

      const user = {
        name: username,
        highScore: 0,
      }

      commit('SET_USER', user)
      return true
    },
    logout({ commit }) {
      commit('LOGOUT')
    },
  },
}
