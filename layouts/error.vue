<template>
	<div>
		<Loader />
		<Header />
		<div class="error">
			<Hero title="ERROR 404" />
		</div>
	</div>
</template>

<script>
import detectBrowserAndDevice from '@/helpers/detectBrowserAndDevice';
export default {
	created() {
		if (process.client) {
			this.$gtm.push({
				event: 'Pageview',
				page: {
					url: window.location.protocol + '//' + window.location.hostname + this.$route.fullPath,
					path: this.$route.fullPath,
					title: '404',
					type: '404',
					language: this.$route.meta.lang,
				},
			});
		}
	},
	mounted() {
		// Add classes to body for device type and special browsers
		detectBrowserAndDevice(this);
		this.$nextTick(() => {
			this.$nuxt.$emit('loader-hide');
		});
	},
};
</script>

<style lang="scss">
.error {
	height: 100vh;
	background-color: #000;
}
</style>
