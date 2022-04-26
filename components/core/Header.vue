<template>
	<header class="header">
		<SvgIcon name="logo" className="logo" />
		<button class="btn" @click="onToggleMenu">
			<SvgIcon name="menu" className="svg-menu" />
		</button>
		<Menu :isVisible="isMenuOpened" @onToggleMenu="onToggleMenu" />
	</header>
</template>

<script>
import Menu from '@/components/core/Menu.vue';
import SvgIcon from '@/components/shared/SvgIcon/SvgIcon.vue';
export default {
	data() {
		return {
			isMenuOpened: false,
		};
	},
	components: {
		SvgIcon,
		Menu,
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
	z-index: 10;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	padding: 40px;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.svg-menu {
		width: 32px;
		height: 32px;
		fill: white;
	}

	.logo {
		width: 48px;
		height: 48px;
	}

	.btn {
		background: none;
	}
}
</style>
