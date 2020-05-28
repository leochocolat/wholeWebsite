export const actions = {
    setPages({ commit }, pages) {
        commit('SET_PAGES', pages);
    },

    setCurrent({ commit }, current) {
        commit('SET_CURRENT', current);
    },

    setPrevious({ commit }, previous) {
        commit('SET_PREVIOUS', previous);
    }
}

export default actions;