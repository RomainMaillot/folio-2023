<template>
	<component :is="iconComponent" role="img" v-bind:class="className" />
</template>

<script>
const icons = {
	logo: () => import('./svgs/Logo.vue'),
	menu: () => import('./svgs/Menu.vue'),
	close: () => import('./svgs/Close.vue'),
};

export default {
	name: 'SvgIcon',
	props: {
		name: {
			type: String,
			required: true,
		},
		className: {
			type: String,
		},
	},

	computed: {
		iconComponent() {
			return icons[this.name] ? icons[this.name] : null;
		},
	},
};
</script>
