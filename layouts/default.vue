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
	mounted() {
		// Add classes to body for device type and special browsers
		detectBrowserAndDevice(this);
	},
};
</script>
