import Emitter from 'tiny-emitter'

export default class Interface {
	constructor() {
		this.emitter = new Emitter()

		this.$on = (...args) => this.emitter.on(...args)

		this.$once = (...args) => this.emitter.once(...args)

		this.$off = (...args) => this.emitter.off(...args)

		this.$emit = (...args) => this.emitter.emit(...args)
	}
}
