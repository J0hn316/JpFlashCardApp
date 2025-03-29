export default {
  namespace: true,
  state: () => ({
    user: null,
  }),
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
  },
  actions: {
    login({ commit }, credentials) {
      const fakeUser = { username: credentials.username }
      commit('SET_USER', fakeUser)
    },
  },
}
