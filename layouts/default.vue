<template>
	<div>
		<Loader />
		<Header />
		<Nuxt />
	</div>
</template>

<script>
import Header from '@/components/core/Header.vue';
import Loader from '@/components/core/Loader.vue';
export default {
	components: {
		Header,
		Loader,
	},
};
</script>
