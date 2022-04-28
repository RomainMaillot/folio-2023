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
		// Add classes to body
		detectBrowserAndDevice(this);
	},
};
</script>
