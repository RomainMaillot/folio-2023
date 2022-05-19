<template>
	<div class="hero">
		<h1>{{ title }}</h1>
	</div>
</template>

<script>
export default {
	props: {
		title: String,
	},
};
</script>

<style lang="scss" scoped>
.hero {
	height: 100vh;
	@include flex(center, center);

	h1 {
		@include h1-style;
	}
}
</style>
