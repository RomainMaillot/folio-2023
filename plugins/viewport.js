import Vue from 'vue';

const Viewport = new Vue({
	data() {
		if (!process.client) return {};
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight,
		};
	},
	created() {
		if (!process.client) return {};

		this.width = document.documentElement.clientWidth;
		this.height = document.documentElement.clientHeight;

		this.resizeSmoothDebounced = this.debounce(this.onResizeDebounced, 400);
		this.setEvents();
		this.onResize();
	},
	methods: {
		/**
		 * Events Listenners
		 */
		setEvents() {
			window.addEventListener('resize', this.onResize, false);
		},

		removeEvents() {
			window.removeEventListener('resize', this.onResize, false);
		},

		onResize() {
			this.width = document.documentElement.clientWidth;
			this.height = document.documentElement.clientHeight;

			this.$emit('resize');
			this.resizeSmoothDebounced();

			const doc = document.documentElement;
			doc.style.setProperty('--app-height', `${window.innerHeight}px`);
		},

		onResizeDebounced() {
			this.$emit('resize-debounce');
		},

		debounce(func, wait, immediate) {
			let timeout;
			return function () {
				let context = this,
					args = arguments;
				let later = function () {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				let callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		},
	},
	beforeDestroy() {
		this.removeEvents();
	},
});

// This exports the plugin object.
export default {
	install(Vue) {
		Vue.prototype.$viewport = Viewport;
	},
};
