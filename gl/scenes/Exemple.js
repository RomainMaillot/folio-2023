import Core from '~/gl/Core';
import AssetManager from '~/gl/utils/AssetManager';
import Controls from '~/gl/utils/Controls';
import * as THREE from 'three';
import PostProcessing from '~/gl/postprocessing';
import GUI from './GUI';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import SceneLights from './Lights';
import vertexExample from '~/gl/shaders/vertexExample.glsl';
import fragmentExample from '~/gl/shaders/fragmentExample.glsl';

export default class ExampleScene extends Core {
	constructor(opt = {}) {
		super();
		if (!process.client) return;
		this.gui = new GUI(this);
		this.isDestroyed = false;
		this.time = 0;
		this.mouseX = 0;
		this.mouseY = 0;
		this.groupExample = new THREE.Group();

		this.post = new PostProcessing(this);
		this.controls = new Controls(this, this.camera, this.renderer?.domElement, this.gui);
		this.transformer = new TransformControls(this.camera, this.renderer?.domElement);
		this.lights = new SceneLights(this);

		this.material = null;
		this.transformer.addEventListener('dragging-changed', (event) => {
			this.controls.enabled = !event.value;
		});

		// Events
		this._onScroll = this.onScroll.bind(this);
		this._onMouseMove = this.onMouseMove.bind(this);
		this._onPointerdown = this.onPointerdown.bind(this);

		this.post.$on(
			'loaded',
			() => {
				this.setupCamera();
			},
			this
		);
	}

	init(parent) {
		super.init(parent);
		window.addEventListener('wheel', this._onScroll);
		this.pointer.$on('mousemove', this._onMouseMove);
		this.pointer.$on('pointerdown', this._onPointerdown);
		this.loadScene();
	}

	onScroll(event) {
		// console.log('scroll', event);
		const lerpedValue = THREE.MathUtils.lerp(this.sphereGroup.rotation.x, this.sphereGroup.rotation.x + 0.0005 * event.deltaY, 0.3);
		this.sphereGroup.rotation.x = lerpedValue;
	}

	onMouseMove(event) {
		if (this.pointer.isDown) {
			console.log(event);
			var deltaX = this.pointer.raw.x - this.mouseX;
			var deltaY = this.pointer.raw.y - this.mouseY;
			this.mouseX = this.pointer.raw.x;
			this.mouseY = this.pointer.raw.y;
			const lerpedValueX = THREE.MathUtils.lerp(this.sphereGroup.rotation.x, this.sphereGroup.rotation.x + 0.008 * -deltaY, 0.1);
			this.sphereGroup.rotation.x = lerpedValueX;
			const lerpedValueY = THREE.MathUtils.lerp(this.sphereGroup.rotation.y, this.sphereGroup.rotation.y + 0.008 * -deltaX, 0.1);
			this.sphereGroup.rotation.y = lerpedValueY;
		}
	}

	onPointerdown() {
		this.mouseX = this.pointer.raw.x;
		this.mouseY = this.pointer.raw.y;
	}

	destroy() {
		if (this.isDestroyed) return;
		super.destroy();

		window.removeEventListener('wheel', this._onScroll);
		this.post.destroy();
		this.gui.destroy();

		this.isDestroyed = true;
	}

	setupCameraGUI() {
		this.gui.camera.on('change', () => this.camera.updateProjectionMatrix());

		this.gui.camera.addInput(this.camera, 'fov', {
			view: 'cameraring',
			series: 0,
		});

		this.gui.camera.addInput(this.camera, 'zoom', {
			view: 'cameraring',
			series: 1,
			min: 0.1,
			step: 0.1,
			max: 3,
		});
	}

	setupCamera() {
		this.camera.position.z = 10;
		this.scene.add(this.camera);
		this.setupCameraGUI();
		this.post.setTargetDOF(this.raycaster.helper.position);
	}

	update(_time, _delta) {
		super.update(_time, _delta);
		this.time++;
		this.stats.begin();
		this.post?.update();
		this.controls?.update();

		if (this.post?.enabled) {
			this.post.composer?.render();
			this.renderer.autoClear = false;
		} else {
			this.renderer.render(this.scene, this.camera);
			this.renderer.autoClear = true;
		}

		// Update shader uniforms
		if (this.cubeMesh) {
			this.cubeMesh.material.uniforms.u_time.value = this.time * 0.01;
		}

		this.stats.end();
	}

	async loadScene() {
		await AssetManager.load([
			{ url: '/textures/img_horiz.jpg', key: 'img-horiz' },
			{ url: '/textures/img_paysage.jpg', key: 'img-paysage' },
			{ url: '/textures/img2_paysage.jpg', key: 'img-paysage2' },
			{ url: '/models/duck.gltf', key: 'duck' },
		]);

		this.textures = [];
		this.textures.push(new THREE.Texture(AssetManager.get('img-horiz').image));
		this.textures.push(new THREE.Texture(AssetManager.get('img-paysage').image));
		this.textures.push(new THREE.Texture(AssetManager.get('img-paysage2').image));

		// Add gltf object to scene
		this.gltfObject = AssetManager.get('duck').scene;
		this.gltfObject.position.set(-10, -1, -10);
		this.gltfObject.rotation.set(0, 1, 0);
		this.gltfObject.name = 'Duck';
		this.groupExample.add(this.gltfObject);

		const geometry = new THREE.BoxGeometry(2, 2, 2);
		const uniforms = {
			u_time: { value: 1.0 },
			u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
		};
		// const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
		const material = new THREE.ShaderMaterial({
			uniforms,
			vertexShader: vertexExample,
			fragmentShader: fragmentExample,
		});
		this.cubeMesh = new THREE.Mesh(geometry, material);
		this.cubeMesh.name = 'TestCube';
		this.cubeMesh.position.set(-5, 0, -4);
		this.groupExample.add(this.cubeMesh);

		// Create floor
		// var floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
		// var floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		// floor.position.set(0, -1.2, 0);
		// floor.rotation.x = -1.55;
		// this.groupExample.add(floor);
		// // Floor GUI
		// this.gui.floor = this.gui.pane.addFolder({
		// 	title: 'Floor',
		// 	expanded: false,
		// });
		// this.gui.floor.addInput(floor, 'rotation');
		// this.gui.floor.addInput(floor, 'position');

		// Create big sphere
		const sphereGeometry = new THREE.SphereGeometry(25, 32, 16);
		const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.material.side = THREE.DoubleSide;
		sphere.position.set(-2, 0, 0);
		this.sphereGroup = new THREE.Group();
		this.sphereGroup.add(sphere);
		this.scene.add(this.sphereGroup);

		// Create plane texture forllowing sphere
		const spherePlaneGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
		const spherePlaneMaterial = new THREE.MeshLambertMaterial({ map: this.textures[0] });
		spherePlaneGeometry.dynamic = true;

		this.gui.plane = this.gui.pane.addFolder({
			title: 'Plane',
			expanded: false,
		});

		spherePlaneGeometry.morphAttributes.position = [];

		const positionAttribute = spherePlaneGeometry.attributes.position;
		const spherePositions = [];

		for (let i = 0; i < positionAttribute.count; i++) {
			const x = positionAttribute.getX(i);
			const y = positionAttribute.getY(i);
			const z = positionAttribute.getZ(i);

			spherePositions.push(x * Math.sqrt(1 - (y * y) / 2 - (z * z) / 2 + (y * y * z * z) / 3), y * Math.sqrt(1 - (z * z) / 2 - (x * x) / 2 + (z * z * x * x) / 3), z * Math.sqrt(1 - (x * x) / 2 - (y * y) / 2 + (x * x * y * y) / 3));
		}

		// add the spherical positions as the first morph target
		spherePlaneGeometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(spherePositions, 3);

		let spherePlaneMesh = new THREE.Mesh(spherePlaneGeometry, spherePlaneMaterial);
		spherePlaneMesh.material.side = THREE.DoubleSide;
		// spherePlaneMesh.position.z = 201;
		spherePlaneMesh.position.y = 5;
		spherePlaneMesh.position.z = -20;
		this.gui.plane.addInput(spherePlaneMesh, 'rotation');
		this.gui.plane.addInput(spherePlaneMesh, 'scale');
		this.gui.plane.addInput(spherePlaneMesh, 'position');
		const test = {
			morph: 0,
		};
		this.gui.plane
			.addInput(test, 'morph', {
				step: 0.1,
				min: 0,
				max: 1,
			})
			.on('change', (ev) => {
				spherePlaneMesh.morphTargetInfluences[0] = ev.value;
			});
		// spherePlaneMesh.morphTargetInfluences[0] = 0.1;
		this.sphereGroup.add(spherePlaneMesh);
		// this.dragControls = new DragControls([this.sphereGroup], this.camera, this.renderer?.domElement);
		// // this.dragControls.addEventListener('drag', this.update);
		// this.dragControls.addEventListener('dragstart', function (event) {
		// 	// event.object.material.emissive.set(0xaaaaaa);
		// 	console.log('dragStart');
		// });

		// this.dragControls.addEventListener('dragend', function (event) {
		// 	// event.object.material.emissive.set(0x000000);
		// 	console.log('dragEnd');
		// });

		// Create plane from texture so the plane is adapted to texture ratio
		this.textures.forEach((texture, index) => {
			let offsetX = 0;
			// Calc offset x so texture doesn't overflows
			for (let i = 0; i < index + 1; i++) {
				if (i > 0) {
					offsetX += this.textures[i].image.width / 1300;
				}
			}
			offsetX = index > 0 ? offsetX + 0.2 : offsetX;
			texture.needsUpdate = true;
			const width = texture.image.width / 1300; // /big number is just to have it little because i took really big texture :)
			const height = texture.image.height / 1300; // /big number is just to have it little because i took really big texture :)
			// here you can create a plane based on width/height image linear proportion
			var planeGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
			var planeMaterial = new THREE.MeshLambertMaterial({ map: texture });
			const plane = new THREE.Mesh(planeGeometry, planeMaterial);
			plane.position.set(offsetX, 0, 0);
			this.raycaster.raycastables.push(plane);
			this.raycaster.clickables.push(plane);
			this.groupExample.add(plane);
		});

		this.groupExample.visible = false;
		this.gui.general.addInput(this.groupExample, 'visible', {
			label: 'groupExample Visible',
		});
		this.gui.general.addInput(this.sphereGroup, 'visible', {
			label: 'sphereGroup Visible',
		});

		// Lock control camera
		this.controls.enabled = false;

		this.scene.add(this.groupExample);
		this.$emit('loaded');
	}
}
