import * as THREE from 'three'
import * as POST from 'postprocessing'
import sRGBEncoding from '@gl/shaders/sRGBEncoding/fragment.glsl'
import { gsap } from 'gsap'
export default class TonePass {
	constructor(composer, camera, gui, gpu) {
		this.composer = composer
		this.camera = camera
		this.gui = gui
		this.gpu = gpu

		this.brightness = {
			raw: 0,
			lerped: 0
		}

		this.BCEffectFolder = this.gui.post.addFolder({
			title: 'Brightness & Contrast',
			expanded: false
		})
		this.colorAverageEffectFolder = this.gui.post.addFolder({
			title: 'Color Average',
			expanded: false
		})
		this.hueSaturationEffectFolder = this.gui.post.addFolder({
			title: 'Hue & Saturation',
			expanded: false
		})
		this.vignetteFolder = this.gui.post.addFolder({
			title: 'Vignette',
			expanded: false
		})
		// this.dotScreenFolder = this.gui.post.addFolder({
		// 	title: 'Dotscreen',
		// 	expanded: false
		// })
		this.noiseFolder = this.gui.post.addFolder({
			title: 'Noise',
			expanded: false
		})
		this.setPasses()
	}

	setPasses() {
		if (!this.composer) return console.error('You have to set the composer first with setComposer()')

		this.setBREffect()

		this.setColorAverage()

		this.setHueSaturationEffect()

		this.setVignetteEffect()

		//this.setDotscreenEffect()

		this.setNoiseEffect()

		this.effect = new CustomEffect('sRGBEncoding', sRGBEncoding, {
			uniforms: {}
		})

		this.tonePass = new POST.EffectPass(
			this.camera,
			this.colorAverageEffect,
			this.hueSaturationEffect,
			this.bcEffect,
			this.vignetteEffect,
			this.noiseEffect
		)

		this.encodePass = new POST.EffectPass(this.camera, this.effect)

		if (this.gpu.tier < 2) this.tonePass.renderToScreen = true
	}

	addPass() {
		this.composer.addPass(this.encodePass)
		this.composer.addPass(this.tonePass)
	}

	removePass() {
		this.composer.removePass(this.encodePass)
		this.composer.removePass(this.tonePass)
	}

	setBREffect() {
		this.bcEffect = new POST.BrightnessContrastEffect({
			brightness: 0,
			contrast: 0
		})
		this.BCEffectFolder.addInput(this.brightness, 'raw', {
			min: -1,
			max: 1
		})
		this.BCEffectFolder.addInput(this.bcEffect, 'contrast', {
			min: -0.1,
			max: 0.1
		})
	}

	setBrightness(_amount = 0, _duration = 3) {
		gsap.to(this.brightness, {
			raw: _amount,
			duration: _duration
		})
	}

	setColorAverage() {
		this.colorAverageEffect = new POST.ColorAverageEffect(POST.BlendFunction.SKIP)
		this.colorAverageEffect.blendMode.opacity.value = 0.005

		this.colorAverageEffectFolder.addInput(this.colorAverageEffect.blendMode.opacity, 'value', {
			min: 0,
			max: 1
		})

		this.colorAverageEffectFolder.addInput(this.colorAverageEffect.blendMode, 'blendFunction', {
			options: POST.BlendFunction
		})
	}

	setHueSaturationEffect() {
		this.hueSaturationEffect = new POST.HueSaturationEffect()

		this.hueSaturationEffectFolder.addInput(this.hueSaturationEffect, 'hue', {
			min: 0,
			max: Math.PI * 2
		})
		this.hueSaturationEffectFolder.addInput(this.hueSaturationEffect, 'saturation', {
			min: -1,
			max: 1
		})
		this.hueSaturationEffectFolder.addInput(this.hueSaturationEffect.blendMode.opacity, 'value', {
			label: 'Blend opacity',
			min: 0,
			max: 1
		})

		this.hueSaturationEffectFolder.addInput(this.hueSaturationEffect.blendMode, 'blendFunction', {
			options: POST.BlendFunction
		})
	}

	setVignetteEffect() {
		this.vignetteEffect = new POST.VignetteEffect({
			offset: 0.25,
			darkness: 0.7
		})

		this.vignetteFolder.addInput(this.vignetteEffect, 'technique', {
			options: POST.VignetteTechnique
		})
		this.vignetteFolder.addInput(this.vignetteEffect, 'offset', {
			min: 0,
			max: 1
		})
		this.vignetteFolder.addInput(this.vignetteEffect, 'darkness', {
			min: 0,
			max: 1
		})
	}

	setDotscreenEffect() {
		this.dotScreenEffect = new POST.DotScreenEffect({
			blendFunction: POST.BlendFunction.SOFT_LIGHT,
			scale: 0.9
		})
		this.dotScreenEffect.blendMode.opacity.value = 0.005
		this.dotScreenFolder.addInput(this.dotScreenEffect.blendMode, 'blendFunction', {
			options: POST.BlendFunction
		})
		this.dotScreenFolder.addInput(this.dotScreenEffect.blendMode.opacity, 'value', {
			min: 0,
			max: 1
		})
	}

	setNoiseEffect() {
		this.noiseEffect = new POST.NoiseEffect({
			blendFunction: POST.BlendFunction.DARKEN
		})
		this.noiseEffect.blendMode.opacity.value = 0.1
		this.noiseFolder.addInput(this.noiseEffect.blendMode, 'blendFunction', {
			options: POST.BlendFunction
		})
		this.noiseFolder.addInput(this.noiseEffect.blendMode.opacity, 'value', {
			min: 0,
			max: 1
		})
	}

	update() {
		this.brightness.lerped = THREE.MathUtils.lerp(this.brightness.lerped, this.brightness.raw, 0.08)
		this.bcEffect.brightness = this.brightness.lerped
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
