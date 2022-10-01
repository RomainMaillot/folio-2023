import Interface from '~/gl/utils/Interface'
import debounce from '~/gl/utils/debounce'

export default class Viewport extends Interface {
	constructor() {
		super()
		if (!process.client) return
		this.width = document.documentElement.clientWidth
		this.height = document.documentElement.clientHeight
		this.devicePixelRatio = window.devicePixelRatio
		this.aspectRatio = this.width / this.height

		this.resizeSmoothDebounced = debounce(this.onResizeDebounced, 400)
		this.setEvents()
	}
	/**
	 * Events Listenners
	 */
	setEvents() {
		window.addEventListener('resize', this.onResize.bind(this), false)
	}

	removeEvents() {
		window.removeEventListener('resize', this.onResize.bind(this), false)
	}

	onResize() {
		this.width = document.documentElement.clientWidth
		this.height = document.documentElement.clientHeight
		this.devicePixelRatio = window.devicePixelRatio
		this.$emit('resize')
		this.resizeSmoothDebounced()
	}

	onResizeDebounced() {
		this.$emit('resize-debounce')
	}
}

const ViewportInstance = new Viewport()
export { ViewportInstance }
