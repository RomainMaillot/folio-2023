import Interface from '~/gl/utils/Interface'
import * as THREE from 'three'
import Raycaster from '~/gl/utils/Raycaster'
import Stats from 'stats-js'
import gsap from 'gsap/all'
import Viewport from '~/gl/utils/Viewport'
import Pointer from '~/gl/utils/Pointer'

export default class Core extends Interface {
	constructor(opt = {}) {
		super()
		if (!process.client) return
		this.options = {
			parent: document.body,
			preserveDrawingBuffer: true,
			antialias: true,
			powerPreference: 'default', //default to hight, might change that in production to 'default'
			precision: 'highp' // default to highp, prevents artefacts for shaders
		}
		this.scene = new THREE.Scene()
		this.hintScene = new THREE.Scene()
		this.time = 0
		this.stats = new Stats()
		this.viewport = new Viewport()
		this.raycaster = new Raycaster(this)
		this.pointer = new Pointer(this)
		this.gpu = null

		gsap.ticker.fps(60)
		this.setupRenderer()
		this.createCamera()
		this._update = this.update.bind(this)
	}

	init(parent = null) {
		if (process.client) document.body.appendChild(this.stats.dom)
		this.viewport.$on('resize', this.resize, this)
		this.pointer.init()
		gsap.ticker.add(this._update)
		if (parent) parent.appendChild(this.renderer.domElement)
		else document.body.appendChild(this.renderer.domElement)
	}

	setupRenderer() {
		this.renderer = new THREE.WebGLRenderer(this.options)
		this.renderer.shadowMap.enabled = false
		//	this.renderer.outputEncoding = THREE.sRGBEncoding
		this.renderer.setClearColor(new THREE.Color(0, 0, 0), 1)
		this.renderer.setPixelRatio(Math.min(1, window.devicePixelRatio))
		this.renderer.setSize(this.viewport.width, this.viewport.height)
	}

	getCanvasImage() {
		return new Promise((resolve) => {
			let image = new Image()
			image.onload = () => {
				resolve(image)
			}
			image.src = this.renderer.domElement.toDataURL('image/png')
		})
	}

	createCamera() {
		this.camera = new THREE.PerspectiveCamera(45, this.viewport.width / this.viewport.height, 0.1, 1000)
	}

	resize() {
		this.camera.aspect = this.viewport.width / this.viewport.height
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(this.viewport.width, this.viewport.height)
	}

	update(_time, _delta) {
		this.time++
	}

	destroy() {
		if (process.client && document.body.contains(this.stats.dom)) document.body.removeChild(this.stats.dom)
		gsap.ticker.remove(this._update)
		this.viewport.$off('resize', this.resize, this)
		this.pointer?.destroy()
		this.raycaster?.destroy()
		this.renderer?.forceContextLoss()
		this.renderer = null
	}
}
