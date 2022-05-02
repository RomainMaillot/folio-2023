import Vue from 'vue'
export default class Observer {
	constructor(el = null, params = {}) {
		this.$el = this.findElement(el)
		if (!this.$el) return
		this.observer = null

		this.default = {
			autoResize: true,
			once: false
		}

		// Default + User parameter
		this.$params = { ...this.default, ...params }

		this.init()
	}

	/**
	 * Check passed element, if html element then returns it,
	 * if selector then querySelector,
	 * if undefined or other type return false
	 *
	 * @param {Element} el
	 * @returns {Boolean || Element}
	 */
	findElement(el) {
		if (!el) {
			console.warn('No linked element to IntersectionObserver')
			return false
		} else if (typeof el === 'string') {
			const tempEl = document.querySelector(el)

			if (!tempEl) {
				console.warn('No element with the selector : ', el)
				return false
			} else {
				return tempEl
			}
		} else if (typeof el === 'object') {
			if (this.isEmpty(el) && !el.nodeName) {
				console.warn('Passed element is empty : ', el)
				return false
			} else {
				return el
			}
		} else {
			console.warn('Element passed is not known : ', el)
			return false
		}
	}

	/**
	 * Initialize the observer and attach corresponding events
	 */
	init() {
		this.observer = this.createObserver()
		this.observer.observe(this.$el)
		this.addEvents()
	}

	/**
	 * Unobserver the element & makes observer elligible for GC
	 */
	destroy() {
		if (this.$params.onDestroy) this.$params.onDestroy(entry)
		if (this.observer) this.observer.unobserve(this.$el)
		this.removeEvents()
		this.observer = null
	}

	/**
	 * Creates the IntersectionObserver instance with passed parameters
	 *
	 * @param {Object} Instance of the Intersection Observer API
	 * @returns {InstanceType} InstanceType of the Intersection Observer API
	 */
	createObserver(params = null) {
		this._update = this.update.bind(this)
		if (params) this.$params = { ...this.default, ...params }
		return new IntersectionObserver(this._update, this.$params)
	}

	/**
	 * Loop through each entries and triggers passed callbacks from parameters
	 *
	 * @param {Array} entries Each entry describes an intersection change for one observed
	 */
	update(entries) {
		entries.forEach((entry) => {
			if(this.$params.trackBoundingClientRect){
				this.bounds = entry.boundingClientRect;
			}
			if (this.$params.onIntersect) this.$params.onIntersect(entry)

			if (this.$params.onVisible && entry.isVisible) this.$params.onVisible(entry)

			if (this.$params.onEnter && entry.isIntersecting) this.$params.onEnter(entry)

			if (this.$params.onLeave && !entry.isIntersecting) this.$params.onLeave(entry)

			if (entry.isIntersecting) {
				if (this.$params.once) {
					if (this.$params.onDestroyOnce) this.$params.onDestroyOnce(entry)
					this.destroy()
				}
			}
		})
	}

	/**
	 * Resize function, removes old observer and creates new one with the parameters or new ones.
	 *
	 * @param {Object} params Observer parameter if there is a change, defaults to null TODO
	 */
	resize() {
		if (this.observer) this.observer.unobserve(this.$el)
		this.observer = this.createObserver()
		this.observer.observe(this.$el)
	}

	/**
	 * Adds events for resize if paramater autoResize : true (defaults to true)
	 */
	addEvents() {
		this._onResize = this.resize.bind(this)
		this.resizeDebounced = this.debounce(this._onResize, 600)
		if (this.$params.autoResize) window.addEventListener('resize', this.resizeDebounced)
	}

	/**
	 * Removes events for resize if paramater autoResize : true (defaults to true)
	 */
	removeEvents() {
		if (this.$params.autoResize) window.removeEventListener('resize', this._onResize)
	}

	/**
	 * Check if an objects is empty or not.
	 *
	 * @param {Object} obj
	 * @returns {Boolean}
	 */
	isEmpty(obj) {
		for (var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				return false
			}
		}

		return JSON.stringify(obj) === JSON.stringify({})
	}

	debounce(func, wait, immediate) {
		let timeout
		return function () {
			let context = this,
				args = arguments
			let later = function () {
				timeout = null
				if (!immediate) func.apply(context, args)
			}
			let callNow = immediate && !timeout
			clearTimeout(timeout)
			timeout = setTimeout(later, wait)
			if (callNow) func.apply(context, args)
		}
	}
}

Vue.directive('observer', {
	bind: (el, binding) => {
		el.observer = new Observer(el, binding.value)
	},
	unbind: (el) => {
		if (el.observer) el.observer.destroy()
	}
})
