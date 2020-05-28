export const actions = {
    setSize({ commit }, size) {
        commit('SET_SIZE', size);
    },

    isTactile({ commit }, isTactile) {
        commit('SET_IS_MOBILE', isTactile);
    },

    isMobile({ commit }, isMobile) {
        commit('SET_IS_MOBILE', isMobile);
    }
}

export default actions
