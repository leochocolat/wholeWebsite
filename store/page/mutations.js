export const mutations = {
	SET_PAGES(state, pages) {
		state.pages = pages;
	},
    
	SET_CURRENT(state, current) {
		state.previous = state.current;
		state.current = current;
	},
	
	SET_PREVIOUS(state, previous) {
		state.previous = previous;
    },
}

export default mutations;