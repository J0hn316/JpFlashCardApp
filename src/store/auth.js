export default {
  namespaced: true,
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  mutations: {
    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user)) // save user to local storage
    },
    LOGOUT(state) {
      state.user = null
      localStorage.removeItem('user') // remove user from local storage
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
