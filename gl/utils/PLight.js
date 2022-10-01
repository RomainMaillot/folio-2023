import * as THREE from 'three'

export default class PLight extends THREE.PointLight {
	constructor(params, Engine) {
		const parameter = {
			...{
				color: 0xff0000,
				intensity: 1,
				distance: 10,
				decay: 1,
				shadow: false,
				interactable: true,
				helper: true,
				name: 'PLight'
			},
			...params
		}
		super(parameter.color, parameter.intensity, parameter.distance, parameter.decay)

		this.engine = Engine
		this.guiColor = { r: this.color.r * 255, g: this.color.g * 255, b: this.color.b * 255 }
		this.params = parameter
		this.name = this.params.name.replace(' ', '_') ?? (Math.random() * 1000).toString()
		this.transform = false
		this.castShadow = this.params.shadow

		this.createInputs()

		if (this.castShadow) this.addShadow()
	}

	createInputs() {
		this.folder = this.engine.gui.lights.addFolder({
			title: this.params.name,
			expanded: false
		})
		if (this.params.interactable) this.createInteractable()
		if (this.params.helper) {
			this.createHelper()
			this.folder.addInput(this.helper, 'visible', {
				label: 'helper',
				presetKey: 'helpervisible' + '_' + this.name
			})
		}

		this.folder.addInput(this, 'visible', {
			presetKey: 'visible' + '_' + this.name
		})

		this.folder.addInput(this, 'position')
		this.folder.addInput(this, 'intensity', {
			min: 0,
			max: 10,
			presetKey: 'intensity' + '_' + this.name
		})
		this.folder.addInput(this, 'distance', {
			presetKey: 'distance' + '_' + this.name
		})
		this.folder.addInput(this, 'decay', {
			presetKey: 'decay_' + this.name
		})
		this.folder
			.addInput(this, 'guiColor', {
				view: 'color',
				label: 'color',
				presetKey: 'guiColor_' + this.name
			})
			.on('change', (_e) => {
				this.color = new THREE.Color(_e.value.r / 255, _e.value.g / 255, _e.value.b / 255)
			})

		this.folder
			.addInput(this, 'castShadow', {
				presetKey: 'castShadow' + '_' + this.name
			})
			.on('change', (_e) => {
				if (_e.value) this.addShadow()
				else this.removeShadow()
			})
	}

	createInteractable() {
		this.folder
			.addInput(this, 'transform', {
				presetKey: 'transform' + '_' + this.name
			})
			.on('change', (_e) => {
				this.engine.transformer.enable = _e.value
				if (_e.value) {
					this.engine.transformer.attach(this)
					this.engine.scene.add(this.engine.transformer)
				} else {
					this.engine.transformer.detach(this)
					this.engine.scene.remove(this.engine.transformer)
				}
			})
		this.engine.transformer.addEventListener('dragging-changed', (event) => {
			this.engine.gui.pane.refresh()
		})
	}

	createHelper() {
		this.helper = new THREE.PointLightHelper(this, 0.5)
		this.engine.scene.add(this.helper)
	}
	addShadow() {
		this.resolution = 1024

		this.shadow.mapSize.width = this.resolution
		this.shadow.mapSize.height = this.resolution
		this.shadowFolder = this.folder.addFolder({
			title: 'Shadow',
			expanded: false
		})
		this.shadow.bias = -0.002

		this.shadowFolder.addInput(this.shadow, 'bias', {
			min: -0.002,
			max: 0.002,
			step: 0.00001,
			presetKey: 'bias' + '_' + this.name
		})

		this.shadowFolder
			.addInput(this, 'resolution', {
				label: 'Shadow resolution',
				presetKey: 'resolution' + '_' + this.name,
				options: {
					'very low': 256,
					low: 512,
					medium: 1024,
					high: 2048,
					'very high': 4096
				}
			})
			.on('change', () => {
				this.shadow.map.dispose()
				this.shadow.map = null
				this.shadow.mapSize.width = this.resolution
				this.shadow.mapSize.height = this.resolution
			})
	}

	removeShadow() {
		this.shadowFolder.dispose()
	}
}
