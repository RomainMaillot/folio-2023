<template>
	<div class="hero">
		<h1></h1>
		{{ title }}
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
	height: 110vh;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
