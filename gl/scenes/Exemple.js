import Core from '~/gl/Core'
import AssetManager from '~/gl/utils/AssetManager'
import Controls from '~/gl/utils/Controls'
import * as THREE from 'three'
// import PostProcessing from '~/gl/postprocessing'
import GUI from './GUI'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import SceneLights from './Lights'
// import Texturer from '~/gl/utils/Texturer'
// import Dust from './Dust'
// import Water from './Water'
// import GodRay from './GodRay'
// import Debug from './Debug'
import Hoverable from './Hoverable'
// import CourtePointe from './CourtePointe'
import { getGPUTier } from 'detect-gpu'

export default class ExampleScene extends Core {
	constructor(opt = {}) {
		super()
		if (!process.client) return
		this.gui = new GUI(this)
		this.isDestroyed = false
		this.time = 0
		this.state = {
			navigating: false
		}
		this.groupExample = new THREE.Group()
		// this.post = new PostProcessing(this)
		// this.texturer = new Texturer(this)
		this.controls = new Controls(this, this.camera, this.renderer?.domElement, this.gui)
		this.transformer = new TransformControls(this.camera, this.renderer?.domElement)
		this.courtePointe = null

		this.hoverables = new Array()
		this.lights = new SceneLights(this)
		this.raycastable = new Array()

		this.material = null
		this.transformer.addEventListener('dragging-changed', (event) => {
			this.controls.enabled = !event.value
		})

		this.$on('Click::Raycaster', this.onClick, this)
		// this.post.$on(
		// 	'loaded',
		// 	() => {
		// 		this.setupCamera()
		// 	},
		// 	this
		// )
	}

	init(parent) {
		super.init(parent)
		this.loadScene()
		this.setupCamera()
		// this.dust = new Dust(this)
		//this.godRay = new GodRay(this)
		// this.debug = new Debug(this)
	}

	destroy() {
		if (this.isDestroyed) return
		super.destroy()

		this.hoverables.forEach((_el) => {
			_el.destroy()
		})
		this.hoverables = new Array()

		// this.post.destroy()
		this.gui.destroy()
		// this.dust?.destroy()
		// this.godRay?.destroy()

		this.$off('Click::Raycaster', this.onClick, this)

		this.isDestroyed = true
	}

	setupCameraGUI() {
		this.gui.camera.on('change', () => this.camera.updateProjectionMatrix())

		this.gui.camera.addInput(this.camera, 'fov', {
			view: 'cameraring',
			series: 0
		})

		this.gui.camera.addInput(this.camera, 'zoom', {
			view: 'cameraring',
			series: 1,
			min: 0.1,
			step: 0.1,
			max: 3
		})
	}

	onClick(_object) {
		console.log(_object)
		// if (_object.name === 'Cylinder001') this.goTo('stars')
		// if (_object.name === 'Basin-Base') this.goTo('water')
	}

	goTo(_e) {
		if (this.controls.free) return

		this.state.navigating = !_e.redirect
		this.controls.navigator.goTo(_e.direction)
	}

	reset() {
		this.controls.navigator.reset(() => {
			this.state.navigating = false
			// this.post.setTargetDOF(this.raycaster.helper.position)
		})
	}

	setupCamera() {
		this.scene.add(this.camera)
		this.setupCameraGUI()
		// this.post.setTargetDOF(this.raycaster.helper.position)
	}

	update(_time, _delta) {
		super.update(_time, _delta)
		this.time++
		this.stats.begin()
		// this.dust?.update()
		// this.godRay?.update()
		// this.water?.update(_delta)
		// this.post?.update()
		// if (this.post?.enabled) {
		// 	this.post.composer?.render()
		// 	this.renderer.autoClear = false
		// } else {
			this.renderer.render(this.scene, this.camera)
			this.renderer.autoClear = true
		// }

		if (this.controls) {
			this.controls.updateControls()
		}
		this.stats.end()
	}

	async loadScene() {
		// await AssetManager.load([{ url: 'https://picsum.photos/200/300', key: 'imageTexture' }])
		//this.groupExample = AssetManager.get('groupExample_baked').scene
		// this.groupExample.copy(AssetManager.get('groupExample_baked_courte_2').scene)

		// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// const material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
		// const cube = new THREE.Mesh( geometry, material );
		// this.groupExample.add(cube);

		this.hoverables = new Array()

		this.hoverables.push(
			(this.planes = new Hoverable(this, 'planes')),
		)

		var planeGeometry
		const context = this
		var texture = new THREE.TextureLoader().load( 'https://picsum.photos/200/300', function ( tex ) {
			console.log( tex.image.width, tex.image.height );
			const width = tex.image.width / 100
			const height = tex.image.height / 100
			// here you can create a plane based on width/height image linear proportion
			planeGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
			var planeMaterial = new THREE.MeshLambertMaterial( { map: texture } );
			const plane = new THREE.Mesh( planeGeometry, planeMaterial );
			const plane2 = new THREE.Mesh( planeGeometry, planeMaterial );
			plane2.position.set(width + 0.1,0,0);
			const plane3 = new THREE.Mesh( planeGeometry, planeMaterial );
			plane3.position.set((width * 2) + 0.2,0,0);
			context.planes.add(plane)
			context.planes.add(plane2)
			context.planes.add(plane3)
			context.groupExample.add(plane);
			context.groupExample.add(plane2);
			context.groupExample.add(plane3);

		} );

		this.gui.general.addInput(this.groupExample, 'visible', {
			label: 'groupExample Visible'
		})

		this.scene.add(this.groupExample)
		this.$emit('loaded')
	}
}
