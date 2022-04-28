<template>
	<SmoothScroll>
		<div class="homepage">
			<Hero title="AkuStack" />
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
.homepage {
	width: 100%;
	background-color: #000;
}
</style>
