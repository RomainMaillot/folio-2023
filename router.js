import Vue from 'vue';
import Router from 'vue-router';

import Home from '~/pages/home';
import GetScrollPositionOnUpdate from '~/pages/getScrollPositionOnUpdate';
import AnimationTests from '~/pages/animationTests';
import StyleGuide from '~/pages/styleGuide';

Vue.use(Router);

const routes = [
	{ path: '/', component: Home },
	{ path: '/animation-test', component: AnimationTests },
	{ path: '/style-guide', component: StyleGuide },
	{
		path: '/get-scroll-position-update',
		component: GetScrollPositionOnUpdate,
	},
];

export function createRouter(ssrContext) {
	return new Router({
		mode: 'history',
		routes,
	});
}
