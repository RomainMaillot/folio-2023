<template>
	<div>
		<Loader />
		<Header />
		<Nuxt />
	</div>
</template>

<script>
import detectBrowserAndDevice from '@/helpers/detectBrowserAndDevice';
export default {
	created() {
		// Sent pageview gtm
		console.log('hey');
		this.$nuxt.$on('page-view', this.pageView);
	},
	mounted() {
		// Add classes to body for device type and special browsers
		detectBrowserAndDevice(this);
	},
	methods: {
		pageView(title) {
			console.log('yoo');
			this.$gtm.push({
				event: 'Pageview',
				page: {
					url: location.protocol + '//' + window.location.hostname + this.$route.fullPath,
					path: this.$route.fullPath,
					title: title,
					type: this.$route.meta.name,
					language: this.$route.meta.lang,
				},
			});
		},
	},
};
</script>
