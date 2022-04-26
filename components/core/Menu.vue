<template>
	<nav class="menu" ref="menu">
		<NuxtLink to="/">Home</NuxtLink>
		<NuxtLink to="/animation-test">Animation Test</NuxtLink>
		<NuxtLink to="/getScrollPositionOnUpdate">Get scroll position</NuxtLink>
		<button class="btn-close" @click="onToggleMenu">
			<SvgIcon name="close" />
		</button>
	</nav>
</template>

<script>
import { gsap } from 'gsap';
import SvgIcon from '@/components/shared/SvgIcon/SvgIcon.vue';
export default {
	props: {
		isVisible: Boolean,
	},
	components: {
		SvgIcon,
	},
	watch: {
		isVisible(newVal, oldVal) {
			gsap.to(this.$refs.menu, { duration: 0.4, x: newVal ? 0 : '100%' });
		},
		$route(to, from) {
			if (to != from) {
				this.$emit('onToggleMenu');
			}
		},
	},
	methods: {
		onToggleMenu() {
			this.$emit('onToggleMenu');
		},
	},
};
</script>

<style lang="scss" scoped>
.menu {
	width: 40vw;
	height: 100vh;
	min-width: 400px;
	position: absolute;
	background-color: rgb(40, 40, 40);
	top: 0;
	right: 0px;
	display: flex;
	flex-direction: column;
	padding: 100px 40px;
	transform: translateX(100%);

	a {
		color: #fff;
		margin-bottom: 2em;
		font-size: 24px;
	}

	.btn-close {
		position: absolute;
		background: none;
		top: 40px;
		right: 40px;
		width: 32px;
		height: 32px;
		fill: #fff;
	}
}
</style>
