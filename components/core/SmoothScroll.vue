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
				smooth: 0.6,
				effects: true,
				ease: 'power4',
			};

			smoothOptions.onUpdate = (smoother) => {
				this.$store.commit('app/setScrollTopPosition', smoother.scrollTop());
			};

			SmootherObservable.smoother = ScrollSmoother.create(smoothOptions);
		},
	},
	mounted() {
		if (process.client) {
			window.scrollTo(0, 0);
		}
		this.setSmoothScroll();
	},
	destroyed() {
		SmootherObservable.smoother.kill();
	},
};
</script>

<style lang="scss" scoped></style>
