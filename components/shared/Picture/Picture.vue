<template>
	<picture v-if="third">
		<source type="image/webp" :data-srcset="data.genericMobileWebp" />
		<source :data-srcset="data.genericMobile" />
		<img
			v-if="parallax"
			:width="data.width"
			:height="data.height"
			class="lazyload"
			:data-src="data.genericMobile"
			:alt="alt ? alt : ''"
			v-parallax />
		<img v-else :width="data.width" :height="data.height" class="lazyload" :data-src="data.genericMobile" :alt="alt ? alt : ''" />
	</picture>
	<picture v-else-if="half">
		<source type="image/webp" media="(max-width: 1440px)" :data-srcset="data.genericMobileWebp" />
		<source type="image/webp" media="(min-width: 1441px)" :data-srcset="data.genericTabletWebp" />
		<source media="(max-width: 1440px)" :data-srcset="data.genericMobile" />
		<source media="(min-width: 1441px)" :data-srcset="data.genericTablet" />
		<img
			v-if="parallax"
			:width="data.width"
			:height="data.height"
			class="lazyload"
			:data-src="data.genericTablet"
			:alt="alt ? alt : ''"
			v-parallax />
		<img v-else :width="data.width" :height="data.height" class="lazyload" :data-src="data.genericTablet" :alt="alt ? alt : ''" />
	</picture>
	<picture v-else>
		<source type="image/webp" media="(max-width: 768px)" :data-srcset="data.genericMobileWebp" />
		<source type="image/webp" media="(min-width: 769px) and (max-width: 1024px)" :data-srcset="data.genericTabletWebp" />
		<source type="image/webp" media="(min-width: 1025px) and (max-width: 1440px)" :data-srcset="data.genericDesktopWebp" />
		<source type="image/webp" media="(min-width: 1441px)" :data-srcset="data.genericWebp" />
		<source media="(max-width: 768px)" :data-srcset="data.genericMobile" />
		<source media="(min-width: 769px) and (max-width: 1024px)" :data-srcset="data.genericTablet" />
		<source media="(min-width: 1025px) and (max-width: 1440px)" :data-srcset="data.genericDesktop" />
		<source media="(min-width: 1441px)" :data-srcset="data.generic" />
		<img
			v-if="parallax"
			:width="data.width"
			:height="data.height"
			class="lazyload"
			:data-src="data.generic"
			:alt="alt ? alt : ''"
			v-parallax />
		<img v-else :width="data.width" :height="data.height" class="lazyload" :data-src="data.generic" :alt="alt ? alt : ''" />
	</picture>
</template>

<script>
export default {
	props: ['data', 'alt', 'half', 'third', 'parallax'],
};
</script>
