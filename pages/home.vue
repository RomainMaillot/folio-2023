<template>
	<SmoothScroll>
		<div class="homepage">
			<Hero title="AkuStack" />
		</div>
	</SmoothScroll>
</template>

<script>
import SmoothScroll from '@/components/core/SmoothScroll.vue';
import Hero from '@/components/sections/Hero.vue';
export default {
	name: 'Home',
	components: {
		SmoothScroll,
		Hero,
	},
};
</script>

<style lang="scss">
.homepage {
	width: 100%;
	background-color: #000;
}
</style>
