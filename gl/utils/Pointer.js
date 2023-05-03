import * as THREE from 'three';
import Interface from '~/gl/utils/Interface';
import { ViewportInstance } from '~/gl/utils/Viewport';

// WIP
export default class Pointer extends Interface {
	constructor() {
		super();
		this.normalized = new THREE.Vector2();
		this.raw = new THREE.Vector2();
		this.isDown = false;

		this._onMouseMove = this.onMouseMove.bind(this);
		this._onPointerMove = this.onPointerMove.bind(this);

		this._onUp = this.onUp.bind(this);
		this._onDown = this.onDown.bind(this);
		this._onClick = this.onClick.bind(this);
		this._onPointerDown = this.onPointerDown.bind(this);

		this.instanced = false;
	}

	init() {
		if (this.instanced) return;

		console.log('inded');
		window.addEventListener('click', this._onClick);
		window.addEventListener('mousemove', this._onMouseMove);
		window.addEventListener('mousedown', this._onDown);
		window.addEventListener('mouseup', this._onUp);
		document.body.addEventListener('pointermove', this._onPointerMove, false);
		document.body.addEventListener('pointerdown', this._onPointerDown);
		this.instanced = true;
	}

	onClick(_e) {
		console.log('click');
		this.setPointerPos(_e.clientX, _e.clientY);
		this.$emit('click');
	}

	onDown() {
		this.$emit('down');
		this.isDown = true;
	}

	onUp() {
		this.$emit('up');
		this.isDown = false;
	}

	onPointerDown(_e) {
		this.setPointerPos(_e.clientX, _e.clientY);
		this.$emit('pointerdown');
	}

	onMouseMove(_e) {
		this.setPointerPos(_e.clientX, _e.clientY);
		this.$emit('mousemove', _e);
	}

	onPointerMove(_e) {
		this.setPointerPos(_e.clientX, _e.clientY);
		this.$emit('pointermove', _e);
	}

	setPointerPos(x, y) {
		// calculate pointer position in normalized device coordinates
		// (-1 to +1) for both components
		this.raw.x = x;
		this.raw.y = y;
		this.normalized.x = (x / ViewportInstance.width) * 2 - 1;
		this.normalized.y = -(y / ViewportInstance.height) * 2 + 1;
	}

	destroy() {
		window.removeEventListener('mousemove', this._onMouseMove);
		window.removeEventListener('click', this._onClick);
		document.body.removeEventListener('pointermove', this._onPointerMove);
		this.instanced = false;
	}
}

const PointerInstance = new Pointer();
export { PointerInstance };
