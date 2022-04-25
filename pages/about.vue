<template>
	<SmoothScroll>
		<div class="about">
			<NuxtLink to="/">Home</NuxtLink>
		</div>
	</SmoothScroll>
</template>

<script>
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export default {
	name: 'About',
};
</script>

<style lang="scss">
.about {
	height: 200vh;
	width: 100%;
	background-color: lightcyan;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
