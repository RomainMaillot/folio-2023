<template>
	<SmoothScroll>
		<div class="styleguide">
			<Hero title="StyleGuide" />
			<div class="section section--typography">
				<h2 class="section__title">Typography</h2>
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
			<div class="section section--spacers">
				<h2 class="section__title">Spacers</h2>
				<div class="spacer spacer-xxs">xxs</div>
				<div class="spacer spacer-xs">xs</div>
				<div class="spacer spacer-s">s</div>
				<div class="spacer spacer-m">m</div>
				<div class="spacer spacer-l">l</div>
				<div class="spacer spacer-xl">xl</div>
				<div class="spacer spacer-xxl">xxl</div>
			</div>
			<div class="section section--svgs">
				<h2 class="section__title">Svgs</h2>
				<div class="section__container">
					<SvgIcon v-for="svg in svgList" :key="svg" :name="svg" />
				</div>
			</div>
			<div class="section section--colors">
				<h2 class="section__title">Colors</h2>
				<div class="color-main">Color Main ( $color-main )</div>
				<div class="color-secondary">Color Secondary ( $color-secondary )</div>
				<div class="color-text-main">Color Text Main ( $color-text-main )</div>
				<div class="color-text-secondary">Color Text Secondary ( $color-text-secondary )</div>
			</div>
		</div>
	</SmoothScroll>
</template>

<script>
import svgList from '@/components/shared/SvgIcon/svgList';

export default {
	data() {
		return {
			svgList: svgList,
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.$nuxt.$emit('loader-hide');
		});
	},
};
</script>

<style lang="scss" scoped>
.styleguide {
	width: 100%;
	background-color: #fff;
	padding: 0 $m $m $m;
	color: #000;

	@media #{$mobile-large} {
		padding: 0 $xxs $xxs $xxs;
	}

	.image {
		width: 100%;
		height: auto;
	}

	.section {
		margin-bottom: $m;

		&__container {
			padding: 0 $xs $xs $xs;
		}

		&__title {
			@extend .h4-style;
			padding: $xs;
			background-color: #000;
			color: #fff;
			margin-bottom: $xs;
		}

		&--svgs {
			background-color: gray;

			svg {
				width: 48px;
				height: 48px;
				fill: #fff;
				margin-right: $xs;
			}
		}

		&--spacers {
			margin-top: $s;

			div {
				margin-bottom: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		&--colors {
			.color-main {
				display: flex;
				align-items: center;
				margin-bottom: $xxs;
				line-height: 1em;
				&:before {
					content: '';
					display: block;
					width: 1em;
					height: 1em;
					background-color: $color-main;
					display: inline-block;
					border-radius: 4px;
					margin-right: 5px;
					border: 1px solid gray;
				}
			}
			.color-secondary {
				display: flex;
				align-items: center;
				margin-bottom: $xxs;
				line-height: 1em;
				&:before {
					content: '';
					display: block;
					width: 1em;
					height: 1em;
					background-color: $color-secondary;
					display: inline-block;
					border-radius: 4px;
					margin-right: 5px;
					border: 1px solid gray;
				}
			}
			.color-text-main {
				display: flex;
				align-items: center;
				margin-bottom: $xxs;
				line-height: 1em;
				&:before {
					content: '';
					display: block;
					width: 1em;
					height: 1em;
					background-color: $color-text-main;
					display: inline-block;
					border-radius: 4px;
					margin-right: 5px;
					border: 1px solid gray;
				}
			}
			.color-text-secondary {
				display: flex;
				align-items: center;
				margin-bottom: $xxs;
				line-height: 1em;
				&:before {
					content: '';
					display: block;
					width: 1em;
					height: 1em;
					background-color: $color-text-secondary;
					display: inline-block;
					border-radius: 4px;
					margin-right: 5px;
					border: 1px solid gray;
				}
			}
		}
	}

	.spacer {
		background-color: lightgray;

		&-xxs {
			width: $xxs;
			height: $xxs;
		}

		&-xs {
			width: $xs;
			height: $xs;
		}

		&-s {
			width: $s;
			height: $s;
		}

		&-m {
			width: $m;
			height: $m;
		}

		&-l {
			width: $l;
			height: $l;
		}

		&-xl {
			width: $xl;
			height: $xl;
		}

		&-xxl {
			width: $xxl;
			height: $xxl;
		}
	}
}
</style>
