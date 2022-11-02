import * as THREE from 'three';
import * as POST from 'postprocessing';
import SMAAPass from './pass/SMAAPass';
import TonePass from './pass/TonePass';
import DoFPass from './pass/DoFPass';
import Interface from '~/gl/utils/Interface';
import { getGPUTier } from 'detect-gpu';
export default class PostProcessing extends Interface {
	constructor(engine) {
		super();
		this.engine = engine;
		this.pass = null;
		this.gui = engine.gui;
		this.vignettePass = null;
		this.enabled = true;
		this.gui.post.hidden = false;
		this.gui.post.addInput(this, 'enabled').on('change', () => {
			if (this.enabled) this.addPasses();
			else this.removePasses();
		});
		this.loaded = false;

		this.gpuTier();
	}

	async gpuTier() {
		const gpuTier = await getGPUTier();
		this.gpu = gpuTier;

		this.setComposer(this.engine.renderer, this.engine.scene, this.engine.camera);
		this.loaded = true;

		this.$emit('loaded');
	}

	/**
	 *
	 * @param {THREE.WebGLRenderer} renderer THREE renderer, used to create the composer
	 */
	setComposer(renderer, scene, camera) {
		this.composer = new POST.EffectComposer(renderer, {
			//multisampling: renderer.capabilities.isWebGL2 ? 1 : 0
		});
		this.composer.autoRenderToScreen = true;
		this.scene = scene;
		this.camera = camera;

		this.setPasses();
	}

	setPasses() {
		this.renderPass = new POST.RenderPass(this.scene, this.camera);

		this.DoFPass = new DoFPass(this.engine, this.composer, this.gpu);

		this.tonePass = new TonePass(this.composer, this.camera, this.gui, this.gpu);

		this.smaaPass = new SMAAPass(this.composer, this.camera, this.gui, this.gpu);

		this.addPasses();
	}

	addPasses() {
		this.composer.addPass(this.renderPass);
		this.DoFPass.addPass();
		this.tonePass.addPass()
		this.smaaPass.addPass();
	}

	removePasses() {
		this.composer.removePass(this.renderPass);
		this.DoFPass.removePass();
		this.tonePass.removePass()
		this.smaaPass.removePass();
	}

	resize(width, height) {
		this.composer?.setSize(width, height);
	}

	setTargetDOF(target) {
		this.DoFPass?.setTargetDOF(target);
	}

	setFocal(_amount = 0.01) {
		this.DoFPass?.setFocal(_amount);
	}

	update() {
		if (!this.loaded) return;

		this.tonePass?.update();
		this.DoFPass?.update();
	}

	destroy() {}
}
