<template>
	<SmoothScroll>
		<div class="styleguide">
			<Hero title="StyleGuide" />
			<div class="section typography">
				<h2 class="title">Typography</h2>
				<h1 class="uber-style">Uber Style</h1>
				<h1 class="h1-style">H1 Style</h1>
				<h2 class="h2-style">H2 Style</h2>
				<h3 class="h3-style">H3 Style</h3>
				<h4 class="h4-style">H4 Style</h4>
				<h5 class="h5-style">H5 Style</h5>
				<h6 class="h6-style">H6 Style</h6>
				<p class="body-l-style">Body-l Style</p>
				<p class="body-m-style">Body-m Style</p>
				<p class="body-s-style">Body-s Style</p>
			</div>
			<div class="section spacers">
				<h2 class="title">Spacers</h2>
				<br />
				<div class="spacer-xxs">xxs</div>
				<div class="spacer-xs">xs</div>
				<div class="spacer-s">s</div>
				<div class="spacer-m">m</div>
				<div class="spacer-l">l</div>
				<div class="spacer-xl">xl</div>
				<div class="spacer-xxl">xxl</div>
			</div>
			<div class="section svgs">
				<h2 class="title">Svgs</h2>
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

	.title {
		padding: $xs;
		background-color: #fff;
		color: #000;
		@extend .h4-style;
		margin-bottom: $xxs;
	}

	.section {
		margin-bottom: $m;
	}

	.spacers {
		margin-top: $s;
		div {
			margin-bottom: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.spacer-xxs {
		width: $xxs;
		height: $xxs;
		background-color: gray;
	}
	.spacer-xs {
		width: $xs;
		height: $xs;
		background-color: gray;
	}
	.spacer-s {
		width: $s;
		height: $s;
		background-color: gray;
	}
	.spacer-m {
		width: $m;
		height: $m;
		background-color: gray;
	}
	.spacer-l {
		width: $l;
		height: $l;
		background-color: gray;
	}
	.spacer-xl {
		width: $xl;
		height: $xl;
		background-color: gray;
	}
	.spacer-xxl {
		width: $xxl;
		height: $xxl;
		background-color: gray;
	}
}
</style>
