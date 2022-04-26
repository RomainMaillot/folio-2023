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
	props: ['exposeScrollPosition'],
	methods: {
		setSmoothScroll() {
			const smoothOptions = {
				speed: 2.4,
				effects: true,
				ease: 'power4',
			};

			if (this.exposeScrollPosition) {
				smoothOptions.onUpdate = (smoother) => {
					this.$store.commit(
						'app/setScrollTopPosition',
						smoother.scrollTop()
					);
				};
			}
			SmootherObservable.smoother = ScrollSmoother.create(smoothOptions);
		},
	},
	created() {},
	mounted() {
		gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
		this.setSmoothScroll();
		ScrollTrigger.refresh();
	},
	destroyed() {
		if (process.client) {
			window.scrollTo(0, 0);
		}
		SmootherObservable.smoother.kill();
	},
};
</script>

<style lang="scss" scoped></style>
