<template>
	<a class="link__external" v-if="link && isExternalLink" :href="link" :target="data.target ? '_blank' : ''" rel="noopener">
		<slot></slot>
		<span v-if="!this.$slots.default">{{ data.customText }}</span>
	</a>
	<NuxtLink v-else-if="link" :to="getPath(link)">
		<slot></slot>
		<span v-if="!this.$slots.default">{{ data.customText }}</span>
	</NuxtLink>
</template>

<script>
export default {
	props: {
		data: {
			default: function () {
				return { url: '' };
			},
		},
	},
	computed: {
		link: function () {
			return this.data.url || '';
		},
		isExternalLink: function () {
			if (this.link.type && this.link.type === 'url') {
				return true;
			} else if (this.link.includes('mailto')) {
				// mailto
				return true;
			} else if (this.link.includes('/uploads')) {
				return true;
			} else if (/^https?:\/\//.test(this.link)) {
				// Absolute URL.
				return !this.link.includes(process.env.SITE_DOMAIN);
			} else {
				// Relative URL.
				return false;
			}
		},
	},
};
</script>
