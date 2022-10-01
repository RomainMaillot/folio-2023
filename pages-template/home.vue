<template>
	<SmoothScroll>
		<div class="homepage">
			<Hero title="TemplateThree" />
		</div>
	</SmoothScroll>
</template>

<script>
export default {
	mounted() {
		this.$nextTick(() => {
			this.$nuxt.$emit('loader-hide');
		});
		this.$nuxt.$emit('page-view', this.metaTitle);
	},
};
</script>

<style lang="scss">
.homepage {
	width: 100%;
	background-color: #000;
}
</style>
