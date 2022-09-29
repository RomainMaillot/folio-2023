import fetch from 'node-fetch';
import Redirections from './redirects.js';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import Routes from './routes.json';
import { sortRoutes } from '@nuxt/utils';

export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'AkuStack',
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
			{ hid: 'robots', name: 'robots', content: process.env.ENV == 'production' ? 'index,follow' : 'noindex,nofollow' },
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['~assets/sass/application.scss'],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [{ src: '~/plugins/vue-plyr', mode: 'client' }, { src: '~/plugins/animations.js', mode: 'client' }, { src: '~/plugins/global.js' }],

	components: [
		{
			path: '~/components', // will get any components nested in let's say /components/test too
			pathPrefix: false,
		},
	],

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: ['nuxt-webpack-optimisations', 'nuxt-lazysizes', '@nuxtjs/device', '@nuxtjs/dotenv', '@nuxtjs/router'],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: ['@nuxtjs/style-resources', '@nuxtjs/apollo', '@nuxtjs/gtm'],

	// GTM ID
	gtm: {
		id: 'GTM-XXXXXXX',
	},

	router: {
		extendRoutes(routes, resolve) {
			const templates = {
				home: resolve(__dirname, 'pages-template/home'),
				styleguide: resolve(__dirname, 'pages-template/styleGuide'),
			};
			routes = [];
			Routes.forEach((r) => {
				routes.push({
					name: r.template + '.' + r.lang,
					path: r.routes,
					component: templates[r.template],
					meta: {
						name: r.template,
						lang: r.lang,
						slugApi: r.slugApi,
					},
				});
			});
			sortRoutes(routes);
			return routes;
		},
	},

	styleResources: {
		scss: ['./assets/sass/utils/media-queries.scss', './assets/sass/utils/style-guide-mixins.scss', './assets/sass/utils/easings.scss', './assets/sass/utils/tools.scss'],
		hoistUseStatements: true,
	},

	webpackOptimisations: {
		features: {
			// enable risky optimisations in dev only
			hardSourcePlugin: process.env.ENV == 'dev',
			parallelPlugin: process.env.ENV == 'dev',
		},
	},

	lazySizes: {
		extendAssetUrls: {
			img: ['src', 'srcset', 'data-src', 'data-srcset'],
			source: ['src', 'srcset', 'data-src', 'data-srcset'],
		},
	},
	server: {
		port: process.env.PORT,
	},
	apollo: {
		includeNodeModules: true,
		clientConfigs: {
			default: '@/apollo/client-configs/default.js',
		},
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	buildDir: '.nuxt',
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
	redirect: async () => {
		if (process.env.NODE_ENV !== 'production') {
			return [];
		}
		let cmsRedirects = [];

		const client = new ApolloClient({
			link: createHttpLink({ uri: process.env.HTTPENDPOINT, fetch }),
			cache: new InMemoryCache(),
		});

		const response = await client.query({
			query: gql`
				{
					redirection {
						redirects {
							origin
							target
							code
						}
					}
				}
			`,
		});

		if (response.data.redirection && response.data.redirection.redirects !== null) {
			cmsRedirects = [...response.data.redirection.redirects].map((item) => {
				return {
					from: item.origin,
					to: item.target,
					code: item.code,
				};
			});
		} else {
			console.log('Connection failed');
		}
		return [...Redirections, ...cmsRedirects];
	},
	pageTransition: {
		leave(el, done) {
			this.$nuxt.$emit('loader-show', done);
		},
	},
};
