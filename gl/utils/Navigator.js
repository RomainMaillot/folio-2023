import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Navigator {
	constructor(engine, camera, cameraTarget, target, gui) {
		this.engine = engine
		this.scene = engine.scene
		this.camera = camera
		this.cameraTarget = cameraTarget
		this.controlsTarget = target
		this.gui = gui
		this.enabled = false
		this.navigating = false
		this.navigated = false
		this.resetting = false

		this.lerpCamera = false
		this.lerpTarget = true

		this.progress = {
			raw: 0,
			lerped: 0,
			past: 0
		}

		this.target = {
			raw: new THREE.Vector3(),
			lerped: new THREE.Vector3()
		}

		this.path = null

		this.setupGUI()

		this.firstPov = new Path({
			name: 'FirstPov',
			navigation: 'firstPov',
			scene: this.scene,
			start: new THREE.Vector3(2, 2.5, 8.5),
			// middle: new THREE.Vector3(3.05, 1.3, 5.35),
			// end: new THREE.Vector3(-11.3, -0.8, -6.8),
			middle: new THREE.Vector3(-11.2, 1.3, 30.4),
			end: new THREE.Vector3(-6.3, -0.2, -1.4),
			gui: this.gui
		})

		this.secondPov = new Path({
			name: 'SecondPov',
			navigation: 'secondPov',
			scene: this.scene,
			start: new THREE.Vector3(2, 2.5, 8.5),
			middle: new THREE.Vector3(0, 2.4, 4.95),
			end: new THREE.Vector3(-2.6, 0.2, 4.15),
			gui: this.gui
		})

		this._update = this.update.bind(this)
		gsap.ticker.add(this._update)
	}

	setupGUI() {
		this.gui.navigator.addInput(this, 'enabled')
		this.gui.navigator.addInput(this.progress, 'raw', {
			label: 'progress',
			min: 0,
			max: 1
		})
		this.gui.navigator.addButton({ title: 'Set path firstPov' }).on('click', () => {
			this.path = this.firstPov
		})
		this.gui.navigator.addButton({ title: 'Set path secondPov' }).on('click', () => {
			this.path = this.secondPov
		})
	}

	destroy() {
		gsap.ticker.remove(this._update)
	}

	update() {
		if (!this.enabled || !this.path) return

		const cameraPosition = this.path.getPoint(this.progress.lerped * 0.95)
		const cameraTarget = this.path.getPoint(0.05 + this.progress.lerped * 0.95)

		if (!this.lerpTarget) this.updateCameraLook(cameraPosition, cameraTarget)
		this.camera.position.lerp(cameraPosition, 0.1)
		if (!this.navigating) this.progress.lerped = THREE.MathUtils.lerp(this.progress.lerped, this.progress.raw, 0.02)
	}

	updateCameraLook(cameraPosition, target) {
		const dirVector = new THREE.Vector3()
		dirVector.subVectors(target, cameraPosition).normalize().multiplyScalar(10)
		this.target.raw.copy(this.camera.position).add(dirVector)
		this.controlsTarget.lerp(this.target.raw, 0.1)
	}

	goTo(direction = 'firstPov') {
		this.enabled = true

		if (direction === 'firstPov') this.path = this.firstPov
		if (direction === 'secondPov') this.path = this.secondPov

		this.engine?.post?.setTargetDOF(this.path.end)

		gsap.to(this.progress, {
			duration: this.path.duration,
			lerped: 1,
			onStart: () => {
				this.navigating = true
				this.lerpTarget = false
			},
			onUpdate: (_val) => {
				if (this.progress.lerped > 0.8 && !this.navigated && this.path.navigation) this.navigate(this.path.navigation)
			},
			onComplete: () => {
				// this.navigating = false
			}
		})
	}

	reset(_callback = () => {}) {
		gsap.to(this.progress, {
			duration: this.path.duration,
			lerped: 0,
			onStart: () => {},
			onUpdate: (_val) => {
				if (this.progress.lerped < 0.5) {
					this.resetting = true
					this.lerpTarget = true
				}
			},
			onComplete: () => {
				this.enabled = false
				this.navigated = false
				this.navigating = false
				this.resetting = false
				_callback()
			}
		})
	}

	getCameraTarget(_camera) {
		var dist = 1
		var cwd = new THREE.Vector3()

		_camera.getWorldDirection(cwd)

		cwd.multiplyScalar(dist)
		cwd.add(_camera.position)
		return cwd
	}

	createCurve(v1 = new THREE.Vector3(), v2 = new THREE.Vector3()) {
		return new THREE.QuadraticBezierCurve3(this.object.position, v1, v2)
	}

	navigate(_path) {
		this.navigated = true
		this.engine.$emit('Navigation', _path)
	}
}

class Path {
	constructor({
		name = 'Path',
		navigation = null,
		duration = 3,
		scene = new THREE.Scene(),
		start = new THREE.Vector3(),
		middle = new THREE.Vector3(),
		end = new THREE.Vector3(),
		gui = null
	}) {
		this.scene = scene
		this.start = start
		this.middle = middle
		this.duration = duration
		this.navigation = navigation
		this.end = end
		this.line = null
		this.gui = gui
		this.curve = this.createCurve(this.start, this.middle, this.end)
		this.line = this.createMesh()
		this.visible = false

		this.folder = this.gui.navigator.addFolder({
			title: name,
			expanded: false
		})

		this.folder.addInput(this, 'visible').on('change', (_e) => {
			if (_e.value) this.show()
			else this.hide()
		})

		this.folder.addInput(this, 'middle').on('change', (_e) => {
			this.refresh()
		})
		this.folder.addInput(this, 'end').on('change', (_e) => {
			this.refresh()
		})
	}

	createCurve(v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3()) {
		return new THREE.QuadraticBezierCurve3(v0, v1, v2)
	}

	updateCurve(start = new THREE.Vector3(), middle = new THREE.Vector3(), end = new THREE.Vector3()) {
		this.curve = this.createCurve(start, middle, end)
	}

	refresh() {
		this.hide()
		this.curve = this.createCurve(this.start, this.middle, this.end)
		this.line = this.createMesh()
		if (this.visible) this.show()
	}

	createMesh() {
		const points = this.curve.getPoints(50)
		const geometry = new THREE.BufferGeometry().setFromPoints(points)
		const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
		return new THREE.Line(geometry, material)
	}

	getPoint(_progress = 0) {
		return this.curve?.getPoint(_progress)
	}

	show() {
		this.scene.add(this.line)
	}

	hide() {
		this.scene.remove(this.line)
	}
}
