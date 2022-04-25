import Vue from 'vue'
import Router from 'vue-router'

import Home from '~/pages/home'
import About from '~/pages/about'
import GetScrollPositionOnUpdate from '~/pages/getScrollPositionOnUpdate'

Vue.use(Router)

const routes = [
	{ path: '/', component: Home },
	{ path: '/about', component: About },
	{
		path: '/getScrollPositionOnUpdate',
		component: GetScrollPositionOnUpdate,
	},
]

export function createRouter(ssrContext) {
	return new Router({
		mode: 'history',
		routes,
	})
}
