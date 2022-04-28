<template>
	<header class="header" :class="{ 'header--mini': isHeaderMini }">
		<div class="header__background"></div>
		<div class="header__container">
			<SvgIcon name="logo" className="header__logo" />
			<button class="header__btn" @click="onToggleMenu">
				<SvgIcon name="menu" className="header__svg-menu" />
			</button>
		</div>
		<Menu :isVisible="isMenuOpened" @onToggleMenu="onToggleMenu" />
	</header>
</template>

<script>
export default {
	data() {
		return {
			isMenuOpened: false,
			isHeaderMini: false,
		};
	},
	watch: {
		'$store.state.app.scrollTopPosition': function () {
			if (this.$store.state.app.scrollTopPosition > 100 && !this.isHeaderMini) {
				this.isHeaderMini = true;
				return;
			}

			if (this.$store.state.app.scrollTopPosition <= 100 && this.isHeaderMini) {
				this.isHeaderMini = false;
				return;
			}
		},
	},
	methods: {
		onToggleMenu() {
			this.isMenuOpened = !this.isMenuOpened;
		},
	},
};
</script>

<style lang="scss">
.header {
	--height: 80px;
	--translate: -15px;
	--ease: ease;

	z-index: 10;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;

	&__container {
		position: relative;
		padding: 0px 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: var(--height);
		z-index: 3;
		transition: transform 0.4s var(--ease);
		.header--mini & {
			transform: translateY(var(--translate));
		}
	}

	&__background {
		z-index: 2;
		position: absolute;
		background-color: #000;
		width: 100%;
		height: var(--height);

		transition: transform 0.4s var(--ease);
		.header--mini & {
			transform: translateY(calc(var(--translate) * 2));
		}
	}

	&__svg-menu {
		width: 32px;
		height: 32px;
		fill: white;
	}

	&__logo {
		width: 48px;
		height: 48px;
		transition: transform 0.4s var(--ease);
		transform: scale(1);

		.header--mini & {
			transform: scale(0.5);
		}
	}

	&__btn {
		background: none;
		font-size: 0px;
	}
}
</style>
