<template>
	<component :is="iconComponent" role="img" v-bind:class="className" />
</template>

<script>
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
	data() {
		return {
			iconComponent: this.getIcon(),
		};
	},
	methods: {
		checkModules() {
			let exist = true;
			try {
				var foo = require(`@/components/shared/SvgIcon/svgs/${this.name}.vue`);
			} catch (e) {
				if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
					console.warn('Icon "' + this.name + '" not found in components/icons');
					exist = false;
				} else throw e;
			}
			return exist;
		},
		getIcon() {
			return this.checkModules() ? () => import(`@/components/shared/SvgIcon/svgs/${this.name}.vue`) : null;
		},
	},
};
</script>
