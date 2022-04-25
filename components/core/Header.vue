<template>
	<header class="header">
		<nav>
			<NuxtLink to="/">Home</NuxtLink>
			<NuxtLink to="/about">About</NuxtLink>
			<NuxtLink to="/getScrollPositionOnUpdate">
				Get scroll position
			</NuxtLink>
		</nav>
	</header>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.header {
	z-index: 10;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	padding: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
