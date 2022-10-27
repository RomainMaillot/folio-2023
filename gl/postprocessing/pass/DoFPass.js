import * as THREE from 'three'
import * as POST from 'postprocessing'

export default class DoFPass {
	constructor(engine, composer, gpu) {
		this.composer = composer
		this.camera = engine.camera
		this.gui = engine.gui
		this.gpu = gpu
		this.raycaster = engine.raycaster
		this.target = new THREE.Vector3()
		this.interpolation = 0.03
		this.force = 3
		this.focal = 0.01

		this.DOFEffectFolder = this.gui.post.addFolder({
			title: 'Depth of Field',
			expanded: false
		})

		this.setPasses()
	}

	setPasses() {
		if (!this.composer) return console.error('You have to set the composer first with setComposer()')

		this.setDOFEffect()

		this.DOFPass = new POST.EffectPass(this.camera, this.DOFEffect)

		this.depthBufferPass = new POST.EffectPass(
			this.camera,
			new POST.DepthEffect({
				blendFunction: POST.BlendFunction.DARKEN
			})
		)

		this.DOFEffectFolder.addInput(this.DOFPass, 'enabled', {
			presetKey: 'dof_enabled'
		})
		this.DOFEffectFolder.addInput(this.raycaster.helper, 'visible', {
			presetKey: 'dof_helper'
		})

		if (this.gpu.tier > 2) this.DOFPass.enabled = true
		else this.DOFPass.enabled = false

		if (this.gpu.tier > 1) this.depthBufferPass.enabled = true
		else this.depthBufferPass.enabled = false
	}

	addPass() {
		this.composer.addPass(this.DOFPass)
		this.composer.addPass(this.depthBufferPass)
	}

	removePass() {
		this.composer.removePass(this.DOFPass)
		this.composer.removePass(this.depthBufferPass)
	}

	setTargetDOF(target = null) {
		this.target = target
		this.DOFEffect.target = new THREE.Vector3().copy(target)
	}

	setDOFEffect() {
		this.DOFEffect = new POST.DepthOfFieldEffect(this.camera, {
			focusDistance: 0.0,
			focalLength: this.focal,
			bokehScale: 3.0,

			blendFunction: POST.BlendFunction.NORMAL
		})
		this.DOFEffect.blurPass.kernelSize = POST.KernelSize.VERY_SMALL
		this.DOFEffect.resolution.scale = 0.4

		this.DOFEffectFolder.addInput(this.DOFEffect, 'bokehScale', {
			label: 'Bokeh',
			min: 0,
			max: 20
		})

		this.DOFEffectFolder.addInput(this.DOFEffect.blurPass, 'kernelSize', {
			label: 'kernel',
			options: POST.KernelSize
		})

		this.DOFEffectFolder.addInput(this, 'focal', {
			label: 'focal',
			min: 0,
			max: 1
		})

		this.DOFEffectFolder.addInput(this.DOFEffect.resolution, 'scale', {
			label: 'resolution',
			min: 0,
			max: 2
		})

		this.DOFEffectFolder.addInput(this.DOFEffect.blendMode, 'blendFunction', {
			options: POST.BlendFunction
		})
		this.DOFEffectFolder.addInput(this, 'interpolation', {
			min: 0,
			max: 1
		})
	}

	setFocal(_amount = 0.01) {
		this.focal = _amount
	}

	update() {
		if (this.gpu.tier < 2) return

		if (this.depthBufferPass && this.DOFPass) this.depthBufferPass.enabled = !this.DOFPass.enabled
		if (this.DOFEffect) {
			this.DOFEffect.bokehScale = THREE.MathUtils.lerp(this.DOFEffect.bokehScale, this.force, 0.01)
			this.DOFEffect.target.lerp(this.target, this.interpolation)
			this.DOFEffect.circleOfConfusionMaterial.uniforms.focalLength.value = THREE.MathUtils.lerp(
				this.DOFEffect.circleOfConfusionMaterial.uniforms.focalLength.value,
				this.focal,
				0.05
			)
		}
	}

	destroy() {}
}
