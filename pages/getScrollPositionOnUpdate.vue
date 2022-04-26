<template>
	<SmoothScroll exposeScrollPosition="true">
		<div class="getScrollPositionOnUpdate">
			Current Scroll Position
			<br />
			{{ $store.state.app.scrollTopPosition }}
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
};
</script>

<style lang="scss">
.getScrollPositionOnUpdate {
	height: 150vh;
	width: 100%;
	background-color: #000;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
}
</style>
