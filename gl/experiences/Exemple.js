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
// import Hoverable from './Hoverable'
// import CourtePointe from './CourtePointe'
import { getGPUTier } from 'detect-gpu'

export default class Workshop extends Core {
	constructor(opt = {}) {
		super()
		if (!process.client) return
		this.gui = new GUI(this)
		this.isDestroyed = false
		this.time = 0
		this.state = {
			navigating: false
		}
		this.workshop = new THREE.Group()
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
		this.loadWorkshop()
		this.setupCamera()
		// this.dust = new Dust(this)
		//this.godRay = new GodRay(this)
		// this.debug = new Debug(this)
	}

	destroy() {
		if (this.isDestroyed) return
		super.destroy()

		// this.hoverables.forEach((_el) => {
		// 	_el.destroy()
		// })
		// this.hoverables = new Array()

		this.post.destroy()
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
			this.post.setTargetDOF(this.raycaster.helper.position)
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

	async loadWorkshop() {
		// await AssetManager.load([{ url: '/models/workshop_baked_courte_pointe.glb', key: 'workshop_baked_courte_2' }])
		//this.workshop = AssetManager.get('workshop_baked').scene
		// this.workshop.copy(AssetManager.get('workshop_baked_courte_2').scene)

		// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// const material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
		// const cube = new THREE.Mesh( geometry, material );
		// this.workshop.add(cube);

		var planeGeometry
		// var texture = new THREE.TextureLoader().load( 'https://picsum.photos/200/300' );
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
			context.workshop.add(plane);
			context.workshop.add(plane2);
			context.workshop.add(plane3);
		} );


		this.gui.general.addInput(this.workshop, 'visible', {
			label: 'Workshop Visible'
		})

		console.log('ah shzt')
		this.hoverables = new Array()

		// this.hoverables.push(
		// 	(this.pictures = new Hoverable(this, 'picture', false)),
		// 	(this.lamp = new Hoverable(this, 'shadows')),
		// 	(this.emboidery = new Hoverable(this, 'broderie')),
		// 	(this.telescope = new Hoverable(this, 'stars')),
		// 	(this.basin = new Hoverable(this, 'water')),
		// 	(this.hoverCourtePointe = new Hoverable(this, 'courte-pointe'))
		// )

		// this.telescope.$on('click', this.goTo, this)

		// this.basin.$on('click', this.goTo, this)

		// this.lamp.$on('click', this.goTo, this)

		// this.emboidery.$on('click', this.goTo, this)

		// this.pictures.$on('click', this.goTo, this)

		// this.hoverCourtePointe.$on('click', this.goTo, this)

		// this.workshop.children.forEach((element) => {
		// 	//console.log(element.userData)
		// 	if (element.userData.type === 'courte-pointe') {
		// 		this.courtePointe = new CourtePointe(element, this.gui.courtePointe)
		// 		this.hoverCourtePointe.add(element)
		// 	}
		// 	if (element.material.map && !this.renderer.capabilities.isWebGL2) element.material.map.encoding = THREE.LinearEncoding
		// 	if (element.name === 'BK_Basin-Water') {
		// 		this.water = new Water(this, element)
		// 		this.basin.add(this.water.mesh)
		// 	}
		// 	if (element.userData.Type === 'Godray') this.godRay = new GodRay(this, element)
		// 	else this.raycastable.push(element)
		// 	if (element.name.includes('BK_Picture')) this.pictures.add(element)
		// 	else if (element.userData.Type === 'Lamp') this.lamp.add(element)
		// 	else if (element.userData.Type === 'Emboidery') this.emboidery.add(element)
		// 	else if (element.userData.Type === 'Telescope') this.telescope.add(element)
		// 	else if (element.userData.Type === 'Basin') this.basin.add(element)

		// 	//if (element.userData.Type) console.log(element.userData.Type)
		// })

		this.scene.add(this.workshop)
		this.$emit('loaded')
	}
}
