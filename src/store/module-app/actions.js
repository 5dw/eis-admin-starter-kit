export function clearLoginStatus({ commit }) {
  commit('SET_USER', {});
  commit('SET_TOKEN', '');
  commit('SET_CRUMBS', '');
  commit('CLEAR_CANI');
}
