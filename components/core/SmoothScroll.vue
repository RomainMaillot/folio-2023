<template>
	<div id="smooth-wrapper">
		<div id="smooth-content">
			<slot />
		</div>
	</div>
</template>

<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SmootherObservable } from '/helpers/SmootherObservable';
export default {
	methods: {
		setSmoothScroll() {
			gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
			const smoothOptions = {
				smooth: 0.7,
				effects: true,
				ease: 'expo',
			};

			smoothOptions.onUpdate = (smoother) => {
				this.$store.commit('app/setScrollTopPosition', smoother.scrollTop());
			};

			SmootherObservable.smoother = ScrollSmoother.create(smoothOptions);
		},
	},
	mounted() {
		this.setSmoothScroll();
		window.scrollTo(0, 0);
		SmootherObservable.smoother.scrollTo(0);
	},
	destroyed() {
		SmootherObservable.smoother.kill();
	},
};
</script>

<style lang="scss" scoped></style>
