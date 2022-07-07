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
				<div class="color-main">Color Main ( --color-main )</div>
				<div class="color-secondary">Color Secondary ( --color-secondary )</div>
				<div class="color-black">Color Black ( --color-black )</div>
				<div class="color-white">Color White ( --color-white )</div>
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
	padding: 0 var(--m) var(--m) var(--m);
	color: #000;

	@media #{$mobile-large} {
		padding: 0 var(--xxs) var(--xxs) var(--xxs);
	}

	.image {
		width: 100%;
		height: auto;
	}

	.section {
		margin-bottom: var(--m);

		&__container {
			padding: 0 var(--xs) var(--xs) var(--xs);
		}

		&__title {
			@include h4-style;
			padding: var(--xs);
			background-color: #000;
			color: #fff;
			margin-bottom: var(--xs);
		}

		&--svgs {
			background-color: gray;

			svg {
				width: 48px;
				height: 48px;
				fill: #fff;
				margin-right: var(--xs);
			}
		}

		&--spacers {
			margin-top: var(--s);

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
				margin-bottom: var(--xxs);
				line-height: 1em;
				&:before {
					content: '';
					display: block;
					width: 1em;
					height: 1em;
					background-color: var(--color-main);
					display: inline-block;
					border-radius: 4px;
					margin-right: 5px;
					border: 1px solid gray;
				}
			}
			.color-secondary {
				display: flex;
				align-items: center;
				margin-bottom: var(--xxs);
				line-height: 1em;
				&:before {
					content: '';
					display: block;
					width: 1em;
					height: 1em;
					background-color: var(--color-secondary);
					display: inline-block;
					border-radius: 4px;
					margin-right: 5px;
					border: 1px solid gray;
				}
			}
			.color-black {
				display: flex;
				align-items: center;
				margin-bottom: var(--xxs);
				line-height: 1em;
				&:before {
					content: '';
					display: block;
					width: 1em;
					height: 1em;
					background-color: var(--color-black);
					display: inline-block;
					border-radius: 4px;
					margin-right: 5px;
					border: 1px solid gray;
				}
			}
			.color-white {
				display: flex;
				align-items: center;
				margin-bottom: var(--xxs);
				line-height: 1em;
				&:before {
					content: '';
					display: block;
					width: 1em;
					height: 1em;
					background-color: var(--color-white);
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
			width: var(--xxs);
			height: var(--xxs);
		}

		&-xs {
			width: var(--xs);
			height: var(--xs);
		}

		&-s {
			width: var(--s);
			height: var(--s);
		}

		&-m {
			width: var(--m);
			height: var(--m);
		}

		&-l {
			width: var(--l);
			height: var(--l);
		}

		&-xl {
			width: var(--xl);
			height: var(--xl);
		}

		&-xxl {
			width: var(--xxl);
			height: var(--xxl);
		}
	}
}
</style>
