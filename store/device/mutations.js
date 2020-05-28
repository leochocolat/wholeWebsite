export const mutations = {
	SET_SIZE(state, viewportSize) {
		state.viewportSize = {
			width: viewportSize.width,
			height: viewportSize.height,
			breakpoint: viewportSize.breakpoint
		}
	},

	SET_IS_TACTILE(state, isTactile) {
		state.isTactile = isTactile;
    },
    
	SET_IS_MOBILE(state, isMobile) {
		state.isMobile = isMobile;
	}
}

export default mutations;
