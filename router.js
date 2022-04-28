import Vue from 'vue';
import Router from 'vue-router';

import Home from '~/pages/home';
import StyleGuide from '~/pages/styleGuide';

Vue.use(Router);

const routes = [
	{ path: '/', component: Home },
	{ path: '/style-guide', component: StyleGuide },
];

export function createRouter(ssrContext) {
	return new Router({
		mode: 'history',
		routes,
	});
}
