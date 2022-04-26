<template>
	<SmoothScroll exposeScrollPosition="true">
		<div class="getScrollPositionOnUpdate">
			<NuxtLink to="about">About</NuxtLink>
		</div>
	</SmoothScroll>
</template>

<script>
import SmoothScroll from '@/components/core/SmoothScroll.vue';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { SmootherObservable } from '/helpers/SmootherObservable';
export default {
	name: 'GetScrollPositionOnUpdate',
	components: {
		SmoothScroll,
	},
	watch: {
		'$store.state.app.scrollTopPosition': function () {
			console.log(this.$store.state.app.scrollTopPosition);
		},
	},
};
</script>

<style lang="scss">
.getScrollPositionOnUpdate {
	height: 150vh;
	width: 100%;
	background-color: lightcoral;
}
</style>
