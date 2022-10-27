import * as THREE from 'three'
import Interface from '~/gl/utils/Interface'
import gsap from 'gsap/all'

export default class Hoverable extends Interface {
	constructor(engine, name, redirect = true, bounding = false, offset = new THREE.Vector3(), simple = false) {
		super()
		this.simple = simple
		this.redirect = redirect
		this.enabled = false
		this.name = name
		this.isTouch = navigator.maxTouchPoints > 0
		this.engine = engine
		this.childs = new Array()
		this.raycastable = this.engine.raycastable

		this.boundingBox = bounding
		this.offset = offset
		this.raycaster = this.engine.raycaster
		this.center = new THREE.Vector3()
		this.positions = new THREE.Vector3()
		this.isHover = false

		this._update = this.update.bind(this)

		gsap.ticker.add(this._update)

		this._onClick = this.onClick.bind(this)
		this.engine.renderer.domElement.addEventListener('click', this._onClick)
	}

	destroy() {
		gsap.ticker.remove(this._update)
		this.engine.renderer?.domElement.removeEventListener('click', this._onClick)
	}

	onClick() {
		if (!this.isHover) return
		if (!this.enabled) return
		console.log('Click Hover')
		const intersects = this.raycaster.ray()
		if (!intersects) return
		let clicked = false

		intersects.forEach((element) => {
			if (element.object.hoverName === this.name) clicked = true
		})

		if (clicked && (this.engine?.post?.hightlightPass.progress > 0.75 || this.isTouch || this.simple))
			this.$emit('click', {
				direction: this.name,
				redirect: this.redirect
			})
	}

	enable() {
		this.enabled = true
	}

	disable() {
		this.enabled = false
	}

	add(_mesh) {
		if (typeof _mesh === 'undefined') return

		_mesh.hover = this.hover.bind(this)
		_mesh.hoverName = this.name
		this.childs.push(_mesh)
		this.raycastable.push(_mesh)
		this.raycaster.hoverable.push(_mesh)
		this.positions.add(_mesh.position)
		this.center.copy(this.positions).divideScalar(this.childs.length)
	}

	addBound(_mesh) {
		if (typeof _mesh === 'undefined') return

		_mesh.hover = this.hover.bind(this)
		_mesh.hoverName = this.name
		_mesh.visible = false

		this.raycastable.push(_mesh)
		this.raycaster.hoverable.push(_mesh)
		this.positions.add(_mesh.position)
		this.center.copy(this.positions).divideScalar(this.childs.length)
	}

	addMeshBound(_mesh) {
		if (typeof _mesh === 'undefined') return

		this.childs.push(_mesh)
	}

	hover() {
		this.isHover = true
		if (this.engine?.post?.hightlightPass && this.engine.interactable && this.enabled && !this.isTouch)
			this.engine?.post?.hightlightPass?.hover(
				this.childs,
				() => {
					this.isHover = false
				},
				this.simple
			)
	}

	update() {
		if (this.simple) return
	}
}
