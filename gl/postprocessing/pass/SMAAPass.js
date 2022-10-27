import * as THREE from 'three'
import * as POST from 'postprocessing'

export default class SMAAPass {
	constructor(composer, camera, gui, gpu) {
		this.composer = composer
		this.sceneCamera = camera
		this.gui = gui
		this.gpu = gpu
		this.smaaPreset = this.gpu.tier < 3 ? POST.SMAAPreset.MEDIUM : POST.SMAAPreset.ULTRA
		this.setPass()
		this.folder = this.gui.post.addFolder({
			title: 'SMAA',
			expanded: false
		})

		this.folder
			.addInput(this.smaaPass, 'enabled', {
				presetKey: 'smaaPass_enabled'
			})
			.on('change', (_e) => {
				if (_e.value) this.composer.addPass(this.smaaPass)
				else this.composer.removePass(this.smaaPass)
			})
		this.folder
			.addInput(this, 'smaaPreset', {
				label: 'quality',
				options: POST.SMAAPreset
			})
			.on('change', (_e) => {
				this.smaaEffect.applyPreset(_e.value)
			})

		this.folder.addInput(this.smaaEffect.edgeDetectionMaterial, 'edgeDetectionMode', {
			label: 'Detection Mode',
			options: POST.EdgeDetectionMode
		})
		this.folder.addInput(this.smaaEffect.edgeDetectionMaterial, 'edgeDetectionThreshold', {
			label: 'Dectection Threshold'
		})

		this.folder.addInput(this.smaaEffect.edgeDetectionMaterial, 'predicationMode', {
			label: 'Predication Mode',
			options: POST.PredicationMode
		})
		this.folder.addInput(this.smaaEffect.blendMode.opacity, 'value', {
			label: 'Blend opacity',
			min: 0,
			max: 1
		})

		this.folder.addInput(this.smaaEffect.blendMode, 'blendFunction', {
			options: POST.BlendFunction
		})
	}

	setPass() {
		if (!this.composer) return console.error('You have to set the composer first with setComposer()')

		this.smaaEffect = new POST.SMAAEffect({
			preset: this.smaaPreset,
			edgeDetectionMode: POST.EdgeDetectionMode.COLOR,
			predicationMode: POST.PredicationMode.DEPTH
		})

		this.smaaPass = new POST.EffectPass(this.sceneCamera, this.smaaEffect)

		if (this.gpu.tier < 2) this.smaaPass.enabled = false
	}

	addPass() {
		this.composer.addPass(this.smaaPass)
	}

	removePass() {
		this.composer.removePass(this.smaaPass)
	}

	update() {}

	destroy() {
		this.folder.dispose()
	}
}
