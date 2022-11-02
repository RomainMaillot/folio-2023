import * as THREE from 'three';
import Interface from '~/gl/utils/Interface';

export default class Raycaster extends Interface {
	constructor(engine) {
		super();
		this.engine = engine;
		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();
		this.intersections = new Array();
		this.clickables = new Array();
		this.raycastables = new Array();

		const geometryHelper = new THREE.ConeGeometry(0.2, 0.2, 3);
		this.helper = new THREE.Mesh(geometryHelper, new THREE.MeshNormalMaterial());
		this.helper.visible = false;
		this.engine.scene.add(this.helper);

		this._update = this.update.bind(this);
		this._onMouseMove = this.onMouseMove.bind(this);

		this._onClick = this.onClick.bind(this);
		this._onMouseMove = this.onMouseMove.bind(this);

		window.addEventListener('click', this._onClick);
		window.addEventListener('mousemove', this._onMouseMove);
	}

	onClick(_e) {
		this.getPointer(_e);
		this.raycast();
		if (this.intersections.length && this.engine) {
			const object = this.checkClickableObjects(this.intersections);
			if (object) {
				console.log('Click on : ', object);
				this.$emit('click', object);
			}
		}
	}

	checkClickableObjects(intersects) {
		let obj = null;
		if (intersects.length) {
			this.clickables.forEach((_object) => {
				if (_object.uuid === intersects[0].object.uuid) obj = _object;
			});
		}
		return obj;
	}

	onMouseMove(_e) {
		this.getPointer(_e);
		this.raycast();

		if (this.intersections.length) {
			const object = this.checkClickableObjects(this.intersections);
			if (object) document.body.style.cursor = 'pointer';
			else document.body.style.cursor = 'default';
		} else document.body.style.cursor = 'default';
	}

	getPointer(_e) {
		// calculate pointer position in normalized device coordinates
		// (-1 to +1) for both components

		this.pointer.x = (_e.clientX / this.engine.viewport.width) * 2 - 1;
		this.pointer.y = -(_e.clientY / this.engine.viewport.height) * 2 + 1;
	}

	raycast() {
		this.intersections = new Array();
		// update the picking ray with the camera and pointer position
		if (this.engine.camera) this.raycaster.setFromCamera(this.pointer, this.engine.camera);
		// calculate objects intersecting the picking ray
		const intersects = this.raycaster.intersectObjects(this.raycastables, false);

		if (!intersects) return;
		for (let i = 0; i < intersects.length; i++) {
			this.intersections = intersects;
		}
		// Toggle rotation bool for meshes that we clicked
		if (intersects.length > 0) {
			this.helper.position.set(0, 0, 0);
			this.helper.lookAt(intersects[0].face.normal);
			this.helper.position.copy(intersects[0].point);
		}
	}

	ray() {
		if (this.engine.camera) this.raycaster.setFromCamera(this.pointer, this.engine.camera);
		const intersects = this.raycaster.intersectObjects(this.raycastables);

		if (intersects.length) {
			return intersects;
		} else return null;
	}

	update() {
		//this.raycast()
	}

	destroy() {
		window.removeEventListener('mousemove', this._onMouseMove);
		window.removeEventListener('click', this._onClick);
	}
}
