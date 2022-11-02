import Core from '~/gl/Core';
import AssetManager from '~/gl/utils/AssetManager';
import Controls from '~/gl/utils/Controls';
import * as THREE from 'three';
import PostProcessing from '~/gl/postprocessing';
import GUI from './GUI';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
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
		this.groupExample = new THREE.Group();

		this.post = new PostProcessing(this);
		this.controls = new Controls(this, this.camera, this.renderer?.domElement, this.gui);
		this.transformer = new TransformControls(this.camera, this.renderer?.domElement);
		this.lights = new SceneLights(this);

		this.material = null;
		this.transformer.addEventListener('dragging-changed', (event) => {
			this.controls.enabled = !event.value;
		});

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
		this.loadScene();
	}

	destroy() {
		if (this.isDestroyed) return;
		super.destroy();

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
		// const material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
		const material = new THREE.ShaderMaterial({
			uniforms,
			vertexShader: vertexExample,
			fragmentShader: fragmentExample,
		});
		this.cubeMesh = new THREE.Mesh(geometry, material);
		this.cubeMesh.name = 'TestCube';
		this.cubeMesh.position.set(-5, 0, -4);
		this.groupExample.add(this.cubeMesh);

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

		this.gui.general.addInput(this.groupExample, 'visible', {
			label: 'groupExample Visible',
		});

		this.scene.add(this.groupExample);
		this.$emit('loaded');
	}
}
