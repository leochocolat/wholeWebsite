export const getters = {
	viewportSize(state) {
		return state.viewportSize;
	},

	isTactile(state) {
		return state.isTactile;
	},

	isMobile(state) {
		return state.isMobile;
	}
}

export default getters
