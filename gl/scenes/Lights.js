import * as THREE from 'three'
import PLight from '~/gl/utils/PLight'
import PSpotlight from '~/gl/utils/PSpotlight'
export default class SceneLights {
	constructor(engine) {
		this.scene = engine.scene
		this.engine = engine
		this.gui = engine.gui

		this.createAmbientLight()
		this.createPointLights()
		this.createSpotlight()
	}

	createAmbientLight() {
		this.ambientLight = new THREE.AmbientLight(0x262626, 3) // soft white light
		this.ambientLight.guiColor = {
			r: this.ambientLight.color.r * 255,
			g: this.ambientLight.color.g * 255,
			b: this.ambientLight.color.b * 255
		}

		this.ambientLightFolder = this.gui.lights.addFolder({
			title: 'Ambient light',
			expanded: false
		})

		this.ambientLightFolder.addInput(this.ambientLight, 'intensity', {
			min: 0,
			max: 10,
			presetKey: 'intensityScene'
		})

		this.ambientLightFolder
			.addInput(this.ambientLight, 'guiColor', {
				view: 'color',
				label: 'color',
				presetKey: 'guiColorScene'
			})
			.on('change', (_e) => {
				this.ambientLight.color = new THREE.Color(_e.value.r / 255, _e.value.g / 255, _e.value.b / 255)
			})
		this.scene.add(this.ambientLight)
		// this.engine.post.hightlightPass.renderPass.selection.add(this.ambientLight)
	}

	createSpotlight() {
		this.spotLight = new PSpotlight(
			{
				name: 'Lamp Light',
				color: '#c2a56c',
				intensity: 1.5,
				distance: 0,
				angle: 1.5,
				penumbra: 0.5,
				shadow: true,
				helper: false,
				interactable: true
			},
			this.engine
		)

		this.spotLight.position.set(-0.5, 1.8, -4.8)

		this.spotLight.shadow.bias = -0.07
		const target = new THREE.Object3D()
		target.position.copy(this.spotLight.position)
		target.position.setY(0)
		this.spotLight.target = target
		this.scene.add(target)
		this.scene.add(this.spotLight)
		// this.engine.post.hightlightPass.renderPass.selection.add(this.spotLight)
	}

	createPointLights() {
		this.sceneLight = new PLight(
			{
				name: 'Scene Light',
				color: 0xbf9239,
				intensity: 2,
				distance: 30,
				decay: 6,
				helper: false
			},
			this.engine
		)
		this.sceneLight.position.set(-0.5, 1.6, 4)
		this.scene.add(this.sceneLight)
		// this.engine.post.hightlightPass.renderPass.selection.add(this.sceneLight)
	}
}
