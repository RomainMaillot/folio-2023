<template>
	<SmoothScroll>
		<div class="getScrollPositionOnUpdate">
			Current Scroll Position
			<br />
			{{ $store.state.app.scrollTopPosition }}
		</div>
	</SmoothScroll>
</template>

<script>
export default {
	mounted() {
		this.$nextTick(() => {
			this.$nuxt.$emit('loader-hide');
		});
	},
};
</script>

<style lang="scss">
.getScrollPositionOnUpdate {
	height: 150vh;
	width: 100%;
	background-color: #000;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
}
</style>
