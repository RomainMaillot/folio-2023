<template>
	<div class="loader" :style="cssVars">
		<div class="loader__bg"></div>
		<div class="loader__inner">
			<SvgIcon name="logo" />
		</div>
	</div>
</template>

<script>
import { gsap } from 'gsap';
export default {
	data() {
		return {
			outDuration: 0.9,
			outDelay: 0.2,
			inDuration: 0.8,
		};
	},
	mounted() {
		// Events
		this.$nuxt.$on('loader-hide', this.loaderEnter);
		this.$nuxt.$on('loader-show', this.loaderLeave);
	},
	computed: {
		cssVars() {
			return {
				'--loader-out-duration': this.outDuration + 's',
				'--loader-out-delay': this.outDelay + 's',
				'--loader-in-duration': this.inDuration + 's',
			};
		},
	},
	methods: {
		loaderEnter() {
			document.body.classList.add('loader-out');
			gsap.delayedCall(this.outDuration + this.outDelay, this.loaderEnterComplete);
		},
		loaderEnterComplete() {},
		loaderLeave(done) {
			document.body.classList.remove('loader-out');
			gsap.delayedCall(this.inDuration, this.loaderLeaveComplete, [done]);
		},
		loaderLeaveComplete(done) {
			done();
		},
	},
};
</script>

<style lang="scss">
:root {
	--loader-out-easing: #{$Power3EaseOut};
	--loader-in-easing: #{$Power3EaseIn};
}

.loader {
	@include flex(center, center);
	@include absoluteBox();
	position: fixed;
	z-index: 90;
	transform-origin: right;
	pointer-events: none;

	&__bg {
		@include absoluteBox();
		background: #1c1c1c;
		backface-visibility: hidden;
		transform-origin: left;
		transform: scaleX(1);
		transition: transform var(--loader-in-duration) var(--loader-in-easing);

		.loader-out & {
			transform-origin: right;
			transform: scaleX(0);
			transition: transform var(--loader-out-duration) var(--loader-out-easing) var(--loader-out-delay);
		}
	}

	&__inner {
		position: relative;

		svg {
			fill: #fff;
			width: 8vw;
			transition: opacity 0.3s 0.6s;

			.loader-out & {
				opacity: 0;
				transition-delay: 0s;
			}
		}
	}
}
</style>
