export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'AkuStrap',
		htmlAttrs: {
			lang: 'en',
		},
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{ hid: 'description', name: 'description', content: '' },
			{ name: 'format-detection', content: 'telephone=no' },
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['~assets/sass/application.scss'],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		{ src: '~/plugins/vue-plyr', mode: 'client' },
		{ src: '~/plugins/animations.js', mode: 'client' },
		{ src: '~/plugins/global.js' },
	],

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		'nuxt-lazysizes',
		'@nuxtjs/device',
		'@nuxtjs/dotenv',
		'@nuxtjs/router',
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: ['@nuxtjs/style-resources'],

	styleResources: {
		scss: [
			'./assets/sass/utils/variables.scss',
			'./assets/sass/utils/easings.scss',
			'./assets/sass/utils/tools.scss',
		],
	},

	lazySizes: {
		extendAssetUrls: {
			img: ['src', 'srcset', 'data-src', 'data-srcset'],
			source: ['src', 'srcset', 'data-src', 'data-srcset'],
		},
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		extend(config, ctx) {
			config.node = {
				fs: 'empty',
			};
		},
		transpile: ['gsap'],
		loaders: {
			sass: {
				implementation: require('sass'),
				sassOptions: {
					fiber: false,
				},
			},
			scss: {
				implementation: require('sass'),
				sassOptions: {
					fiber: false,
				},
			},
		},
	},
};
