<template>
	<SmoothScroll>
		<div class="animation-tests">
			<Hero title="Animation Tests" />
			<div class="tests">
				<p ref="animationGsap">
					Animation : Standard
					<br />
					Quia quae eligendi optio error fugiat, suscipit dicta dolor
					suscipit dicta dolor deleniti! Esse ad voluptatum quo odit
					quisquam officia quae veritatis nobis ipsam commodi.
				</p>
				<!-- GSAP :  -->
				<p ref="animationGsapForce3D">
					Animation : Force3D
					<br />
					Quia quae eligendi optio error fugiat, suscipit dicta dolor
					deleniti! Esse ad voluptatum quo odit quisquam officia quae
					veritatis nobis ipsam commodi.
				</p>
				<!-- GSAP :  -->
				<p ref="animationGsapWillChangeTransform">
					Animation : willChange Transform
					<br />
					Quia quae eligendi optio error fugiat, suscipit dicta dolor
					deleniti! Esse ad voluptatum quo odit quisquam officia quae
					veritatis nobis ipsam commodi.
				</p>
				<!-- GSAP :  -->
				<p ref="animationGsapWillChangeTransformRemoveOnEnd">
					Animation : willChange Transform remove
					<br />
					Quia quae eligendi optio error fugiat, suscipit dicta dolor
					deleniti! Esse ad voluptatum quo odit quisquam officia quae
					veritatis nobis ipsam commodi.
				</p>
				<!-- GSAP : class toggle -->
				<p ref="animationCss" class="animate">
					Animation : css class animation
					<br />
					Quia quae eligendi optio error fugiat, suscipit dicta dolor
					deleniti! Esse ad voluptatum quo odit quisquam officia quae
					veritatis nobis ipsam commodi.
				</p>
				<!-- GSAP :  -->
				<p ref="animationGsapNoAnimation">
					No Animation
					<br />
					Quia quae eligendi optio error fugiat, suscipit dicta dolor
					deleniti! Esse ad voluptatum quo odit quisquam officia quae
					veritatis nobis ipsam commodi.
				</p>

				<div class="btn__wrapper">
					<button class="btn" @click="toggleAnimationsGsap">
						ANIMATE
					</button>
				</div>
			</div>
			<div class="tests">
				<p v-for="item in 20" :key="item">
					Lorem ipsum dolor sit, amet consectetur adipisicing elit.
					Atque, in molestiae quisquam libero non, perspiciatis iure
					ipsam ratione id, harum suscipit eveniet minus iste quas a
					esse culpa reiciendis eaque. adipisicing elit. Quia quae
					eligendi optio error fugiat, suscipit dicta dolor deleniti!
					Esse ad voluptatum quo odit quisquam officia quae veritatis
					nobis ipsam commodi.
				</p>
			</div>
		</div>
	</SmoothScroll>
</template>

<script>
import SmoothScroll from '@/components/core/SmoothScroll.vue';
import Hero from '@/components/sections/Hero.vue';
import { gsap } from 'gsap';
export default {
	name: 'Home',
	components: {
		SmoothScroll,
		Hero,
	},
	methods: {
		toggleAnimationsGsap() {
			const duration = 1.5;
			gsap.fromTo(
				this.$refs.animationGsap,
				{ y: 200, opacity: 0 },
				{ duration: duration, y: 0, opacity: 1 }
			);
			gsap.fromTo(
				this.$refs.animationGsapForce3D,
				{ y: 200, opacity: 0 },
				{ duration: duration, y: 0, opacity: 1, force3D: true }
			);
			gsap.fromTo(
				this.$refs.animationGsapWillChangeTransform,
				{ y: 200, willChange: 'transform', opacity: 0 },
				{ duration: duration, y: 0, opacity: 1 }
			);
			gsap.fromTo(
				this.$refs.animationGsapWillChangeTransformRemoveOnEnd,
				{ y: 200, willChange: 'transform', opacity: 0 },
				{
					duration: duration,
					y: 0,
					opacity: 1,
					onComplete: () => {
						this.$refs.animationGsapWillChangeTransformRemoveOnEnd.style.willChange =
							'unset';
					},
				}
			);

			this.$refs.animationCss.classList.remove('animate-show');
			setTimeout(() => {
				this.$refs.animationCss.classList.add('animate-show');
			}, 1);
		},
	},
};
</script>

<style lang="scss">
.animation-tests {
	width: 100%;
	background-color: #000;
	.tests {
		display: flex;
		gap: 40px;
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
		padding: 200px 20px;
	}
	p {
		width: 340px;
		pointer-events: none;
	}
	.btn {
		padding: 16px;
		border-radius: 16px;
		display: inline-block;

		&__wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			margin-top: 100px;
		}
	}

	.animate {
		transform: translateY(200px);
		opacity: 0;

		&-show {
			transform: translateY(0px);
			opacity: 1;
			transition: transform 1.5s $Power1EaseOut,
				opacity 1.5s $Power1EaseOut;
		}
	}
}
</style>
