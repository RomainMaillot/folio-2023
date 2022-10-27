import * as THREE from 'three'
import * as POST from 'postprocessing'
import SMAAPass from './pass/SMAAPass'
// import TonePass from './pass/TonePass'
import DoFPass from './pass/DoFPass'
// import HighlightPass from './pass/HighlightPass'
import Interface from '~/gl/utils/Interface'
import { getGPUTier } from 'detect-gpu'
import { ViewportInstance } from '~/gl/utils'
export default class PostProcessing extends Interface {
	constructor(engine) {
		super()
		this.engine = engine
		this.pass = null
		this.gui = engine.gui
		this.vignettePass = null
		this.enabled = true
		this.gui.post.hidden = false
		this.gui.post.addInput(this, 'enabled').on('change', () => {
			if (this.enabled) this.addPasses()
			else this.removePasses()
		})
		this.loaded = false

		this.gpuTier()
	}

	async gpuTier() {
		const gpuTier = await getGPUTier()
		this.gpu = gpuTier

		// this.gpu.tier = 1

		this.setComposer(this.engine.renderer, this.engine.scene, this.engine.camera)
		this.loaded = true

		this.$emit('loaded')
	}

	/**
	 *
	 * @param {THREE.WebGLRenderer} renderer THREE renderer, used to create the composer
	 */
	setComposer(renderer, scene, camera) {
		this.composer = new POST.EffectComposer(renderer, {
			//multisampling: renderer.capabilities.isWebGL2 ? 1 : 0
		})
		this.composer.autoRenderToScreen = true
		this.scene = scene
		this.camera = camera

		this.setPasses()
	}

	setPasses() {
		this.renderPass = new POST.RenderPass(this.scene, this.camera)

		this.DoFPass = new DoFPass(this.engine, this.composer, this.gpu)

		// this.hightlightPass = new HighlightPass(this.engine, this.composer, this.gpu)

		// this.tonePass = new TonePass(this.composer, this.camera, this.gui, this.gpu)

		//if (!this.engine.renderer.capabilities.isWebGL2) {
		this.smaaPass = new SMAAPass(this.composer, this.camera, this.gui, this.gpu)
		// this.tonePass.encodePass.enabled = true
		//}
		this.addPasses()
	}

	addPasses() {
		this.composer.addPass(this.renderPass)
		this.DoFPass.addPass()
		// this.hightlightPass.addPasses()
		// this.tonePass.addPass()

		//if (!this.engine.renderer.capabilities.isWebGL2)
		this.smaaPass.addPass()
	}

	removePasses() {
		this.composer.removePass(this.renderPass)
		this.DoFPass.removePass()
		// this.hightlightPass.removePasses()
		// this.tonePass.removePass()

		//if (!this.engine.renderer.capabilities.isWebGL2)
		this.smaaPass.removePass()
	}

	resize(width, height) {
		this.composer?.setSize(width, height)
	}

	setTargetDOF(target) {
		this.DoFPass?.setTargetDOF(target)
	}

	setFocal(_amount = 0.01) {
		this.DoFPass?.setFocal(_amount)
	}

	setBrightness(_amount = 0, _duration = 3) {
		// this.tonePass?.setBrightness(_amount, _duration)
	}

	update() {
		if (!this.loaded) return
		// this.tonePass?.update()
		this.DoFPass?.update()
		// this.DoFPass.force = this.hightlightPass.renderPass.enabled ? 0 : 3
		// this.hightlightPass?.update()
	}

	destroy() {
		// this.hightlightPass.destroy()
	}
}
