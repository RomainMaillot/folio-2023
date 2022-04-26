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
	display: flex;
	align-items: center;
	justify-content: center;

	h1 {
		font-size: 80px;
	}
}
</style>
