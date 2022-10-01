<template>
	<div class="hero">
		<div :class="classes" ref="parent"></div>
	</div>
</template>

<script>
import Exemple from '~/gl/experiences/Exemple'
export default {
	data() {
		return {
			state: null,
			loaded: false
		}
	},
	computed: {
		classes() {
			return [
				'Workshop',
				{
					loaded: this.loaded
				}
			]
		}
	},
	props: {
		title: String,
	},
	mounted() {
		this.workshop = new Exemple()

		this.state = this.workshop.state

		console.log(this.state)

		this.workshop.init(this.$refs.parent)

		this.workshop.$on('Navigation', this.onNavigation)
		this.workshop.$on('loaded', this.onLoaded)

		setTimeout(() => {
			this.loaded = true
		}, 1000);

		this.$nuxt.$on('transition-after-leave', this.onLeave)
	},
	beforeDestroy() {
		//this.workshop?.destroy()
		setTimeout(() => {
			this.workshop?.destroy()
		}, 2000)
		this.workshop.$off('Navigation', this.onNavigation)
		this.workshop.$off('loaded', this.onLoaded)
		//this.$nuxt.$off('ciao', this.onLeave)
	},
	methods: {
		onLeave() {
			this.workshop?.destroy()
			this.workshop = null
		},
		onLoaded() {
			console.log('loaded')
			this.loaded = true
		},
		onNavigation(_direction) {
			// if (_direction === 'stars') this.$router.push(this.localeLocation('/tableaux/etoiles'))
			// if (_direction === 'water') this.$router.push(this.localeLocation('/tableaux/couleurs'))
			// if (_direction === 'shadows') this.$router.push(this.localeLocation('/tableaux/ombres'))
			// if (_direction === 'broderie') this.$router.push(this.localeLocation('/tableaux/broderie'))
			// if (_direction === 'courte-pointe') this.$router.push(this.localeLocation('/courte-pointe'))
		},
		resetView() {
			this.workshop.reset()
		}
	}

};
</script>

<style lang="scss">
.hero {
	height: 100vh;
	@include flex(center, center);

	h1 {
		@include h1-style;
	}

	.Workshop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		transition: 1s opacity ease-in 1s;
		opacity: 0;

		&__canvas {
			position: absolute;
			top: 0;
			left: 0;
			z-index: var(--z-canvas);
			user-select: none;
		}

		&.loaded {
			opacity: 1;
		}
	}

}
</style>
