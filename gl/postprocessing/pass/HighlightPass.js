import * as THREE from 'three'
import * as POST from 'postprocessing'

import hightlight_post from '@gl/shaders/hightlight_post/fragment.glsl'
import alpha_glsl from '@gl/shaders/hightlight_post/alpha.glsl'

import { PointerInstance } from '@gl/utils'

export default class HighlightPass {
	constructor(engine, composer, gpu) {
		this.engine = engine
		this.composer = composer
		this.scene = engine.scene
		this.hintScene = engine.hintScene
		this.camera = engine.camera
		this.gui = engine.gui
		this.gpu = gpu
		this.objects = new Array()
		this.interpolation = 0.1
		this.intensity = 0
		this.progress = 0

		this.time = 0
		this.callbacks = new Array()

		this.outline = {
			visibleColor: '#ffffff',
			hiddenColor: '#ffffff'
		}
		this.target = new THREE.Vector2()

		this.HightlightFolder = this.gui.post.addFolder({
			title: 'Highlight',
			expanded: false
		})

		this.outlineFolder = this.gui.post.addFolder({
			title: 'Outline',
			expanded: false
		})

		this.options = {
			enabled: false,
			blur: 0.2,
			color: '#1b074a',
			color_force: 0.3,
			sepia: 0.6,
			darkness: 0.3
		}

		this.HightlightFolder.addInput(this, 'interpolation')
		this.setPasses()
	}

	setPasses() {
		if (!this.composer) return console.error('You have to set the composer first with setComposer()')

		PointerInstance.init()

		this.renderPass = new POST.RenderPass(this.scene, this.camera)
		this.renderPass.selection = new POST.Selection()
		this.renderPass.clearPass.setClearFlags(false, false, true)

		this.hintPass = new POST.RenderPass(this.hintScene, this.camera)
		this.hintPass.clearPass.setClearFlags(false, false, true)

		this.effect = new CustomEffect('HightLight', hightlight_post, {
			uniforms: {
				u_color: new THREE.Uniform(new THREE.Color(this.options.color)),
				u_color_force: new THREE.Uniform(this.options.color_force),
				u_darkness: new THREE.Uniform(this.options.darkness),
				u_blur: new THREE.Uniform(this.options.blur),
				u_sepia: new THREE.Uniform(this.options.sepia)
			}
		})
		this.effect.blendMode.opacity.value = 0

		this.outlineEffect = new POST.OutlineEffect(this.scene, this.camera, {
			blur: true,
			xRay: true, // BUG SAFARI OUTLINE NEED TO BE TRUE
			edgeStrength: 2,
			kernelSize: POST.KernelSize.SMALL,
			visibleEdgeColor: new THREE.Color(0xdfb92d),
			hiddenEdgeColor: new THREE.Color(0xdfb92d)
		})

		if (this.gpu.tier < 3) {
			this.renderPass.enabled = false
			this.pass = new POST.EffectPass(this.camera, this.outlineEffect)
			if (this.gpu.tier < 2) this.outlineEffect.blur = false
		} else {
			this.pass = new POST.EffectPass(this.camera, this.effect, this.outlineEffect)
		}

		this.setGUI()
		this.disable()
	}

	setGUI() {
		this.outlineFolder.addInput(this.outlineEffect.blurPass, 'scale')
		this.outlineFolder.addInput(this.outlineEffect, 'edgeStrength')

		this.outlineFolder.addInput(this.outlineEffect, 'kernelSize', {
			options: POST.KernelSize
		})

		this.outlineFolder.addInput(this.outline, 'visibleColor').on('change', (_e) => {
			this.outlineEffect.visibleEdgeColor = new THREE.Color(_e.value)
		})

		this.outlineFolder.addInput(this.outline, 'hiddenColor').on('change', (_e) => {
			this.outlineEffect.hiddenEdgeColor = new THREE.Color(_e.value)
		})

		this.HightlightFolder.addInput(this.options, 'enabled')

		this.HightlightFolder.addInput(this.options, 'color').on('change', (_e) => {
			this.effect.uniforms.get('u_color').value = new THREE.Color(_e.value)
		})

		this.HightlightFolder.addInput(this.options, 'blur', {
			min: 0,
			max: 10
		}).on('change', (_e) => {
			this.effect.uniforms.get('u_blur').value = _e.value
		})

		this.HightlightFolder.addInput(this.options, 'color_force', {
			min: 0,
			max: 1
		}).on('change', (_e) => {
			this.effect.uniforms.get('u_color_force').value = _e.value
		})

		this.HightlightFolder.addInput(this.options, 'sepia', {
			min: 0,
			max: 1
		}).on('change', (_e) => {
			this.effect.uniforms.get('u_sepia').value = _e.value
		})

		this.HightlightFolder.addInput(this.options, 'darkness', {
			min: 0,
			max: 1
		}).on('change', (_e) => {
			this.effect.uniforms.get('u_darkness').value = _e.value
		})
	}

	addPasses() {
		this.composer.addPass(this.pass)
		this.composer.addPass(this.renderPass)
		this.composer.addPass(this.hintPass)
	}

	removePasses() {
		this.composer.removePass(this.pass)
		this.composer.removePass(this.renderPass)
		this.composer.removePass(this.hintPass)
	}

	enable() {
		if (this.gpu.tier < 2) return
		this.renderPass.enabled = true
		//this.pass.enabled = true
	}

	disable() {
		this.renderPass.enabled = false
		//this.pass.enabled = false
	}

	update() {
		this.effect.blendMode.opacity.value = THREE.MathUtils.lerp(
			this.effect.blendMode.opacity.value,
			this.options.enabled ? 1 : this.intensity,
			this.interpolation
		)
		this.progress = this.effect.blendMode.opacity.value
		this.outlineEffect.blendMode.opacity.value = this.effect.blendMode.opacity.value

		if (Math.round(this.effect.blendMode.opacity.value * 100) / 100 === Math.round(this.intensity * 100) / 100 && this.intensity === 0)
			this.endHover()
	}

	toScreenPosition(target) {
		if (!target) return null
		var vector = new THREE.Vector3()

		vector.copy(target)

		vector.project(this.camera)

		return new THREE.Vector2(-vector.x, -vector.y)
	}

	hover(objects, cb = () => {}, _simple = false) {
		this.removeObjects()
		this.visible = true
		this.isHover = true

		if (!_simple)
			objects.forEach((_object) => {
				this.objects.push(_object)
				this.renderPass.selection.add(_object)
				this.outlineEffect.selection.add(_object)
			})

		this.callbacks.push(cb)
		document.body.style.cursor = 'pointer'
		if (!_simple) {
			this.intensity = 1
			this.enable()
		}
	}

	removeObjects() {
		this.objects.forEach((_object) => {
			this.outlineEffect.selection.delete(_object)
			this.renderPass.selection.delete(_object)
		})
		this.objects = new Array()
	}

	endHover() {
		if (!this.isHover) return
		this.removeObjects()
		this.isHover = false
		this.disable()

		this.callbacks.forEach((_cb) => {
			_cb()
		})
	}

	hide() {
		this.visible = false
		this.intensity = 0
		document.body.style.cursor = 'inherit'
	}

	destroy() {}
}

class CustomEffect extends POST.Effect {
	constructor(name, fragment, { uniforms = undefined, blendFunction = undefined }) {
		super(name, fragment, {
			uniforms: uniforms ? new Map(Object.entries(uniforms)) : undefined,
			blendFunction: blendFunction
		})
	}
}
