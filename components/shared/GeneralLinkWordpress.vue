<!-- Documentation : https://app.clickup.com/10601487/v/dc/a3h0f-100767/a3h0f-19302 -->

<template>
	<a v-if="link.url && isExternalLink(link.url)" :href="link.url" target="_blank" rel="noopener">
		<slot></slot>
		<template v-if="!this.$slots.default">
			{{ link.title }}
		</template>
	</a>
	<NuxtLink v-else-if="link.url" :to="getPath(link.url)">
		<slot></slot>
		<template v-if="!this.$slots.default">
			{{ link.title }}
		</template>
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
	methods: {
		isExternalLink: function (url) {
			if (url.includes('mailto')) {
				// mailto
				return true;
			} else if (url.includes('app/uploads')) {
				return true;
			} else if (/^https?:\/\//.test(url)) {
				// Absolute URL.
				return !url.includes(process.env.SITE_DOMAIN);
			} else {
				// Relative URL.
				return false;
			}
		},
		getPath(url) {
			try {
				if (url.match(/\?./)) {
					let urlObject = new URL(url);
					var object = { path: urlObject.pathname, query: {} };
					urlObject.searchParams.forEach(function (value, key) {
						object.query[key] = value;
					});
					return object;
				} else if (url.match(/^\/[a-z0-9-/]+$/i)) {
					return url;
				} else {
					return new URL(url).pathname;
				}
			} catch (error) {
				console.log(error);
				return '/';
			}
		},
	},
	computed: {
		link: function () {
			return this.data || { url: '' };
		},
	},
};
</script>
