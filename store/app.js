export const state = () => ({
	scrollTopPosition: 0,
})

export const mutations = {
	setScrollTopPosition: (state, payload) => {
		state.scrollTopPosition = payload
	},
}
