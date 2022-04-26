<template>
	<SmoothScroll>
		<div class="styleguide">
			<Hero title="StyleGuide" />
			<div>
				<h1 class="uber-style" data-lag="0.1">Uber Style</h1>
				<h1 class="h1-style" data-lag="0.2">H1 Style</h1>
				<h2 class="h2-style" data-lag="0.3">H2 Style</h2>
				<h3 class="h3-style" data-lag="0.4">H3 Style</h3>
				<h4 class="h4-style" data-lag="0.5">H4 Style</h4>
				<h5 class="h5-style" data-lag="0.6">H5 Style</h5>
				<h6 class="h6-style" data-lag="0.7">H6 Style</h6>
				<p class="body-l-style" data-lag="0.8">Body-l Style</p>
				<p class="body-m-style" data-lag="0.9">Body-m Style</p>
				<p class="body-s-style" data-lag="1">Body-s Style</p>
			</div>
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
.styleguide {
	width: 100%;
	background-color: #000;
	padding: 100px 100px 400px;
}
</style>
