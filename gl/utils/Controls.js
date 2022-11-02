import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export default class Controls extends OrbitControls {
	constructor(engine, camera, rendererElement) {
		super(camera, rendererElement);
		if (!process.client) return;
		this.engine = engine;
		this.listenToKeyEvents(window);
		this.enabled = true;

		this.engine.gui.controls.addInput(this, 'enabled');
	}
}
