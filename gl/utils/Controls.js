import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { normalize, pipe, mapRange } from 'gsap/all'
import bezier from 'bezier-easing'
import Navigator from './Navigator'

export default class Controls extends OrbitControls {
	constructor(engine, camera, rendererElement) {
		super(camera, rendererElement)
		this.time = 0
		this.engine = engine
		if (!process.client) return
		this.listenToKeyEvents(window)
		this.enabled = false
		this.target = new THREE.Vector3(2, 0.5, -3)
		this.cameraTarget = new THREE.Vector3(2, 0, -3)
		this.progress = 0.5
		this.targetSpeed = 0.0075
		this.cameraTargetInterpolation = 0.05
		this.cameraInterpolation = 0.05
		this.cursorInterpolation = 0.08
		this.free = false
		this.gui = this.engine.gui
		this.baseCameraPosition = new THREE.Vector3(2, 0, 9)
		this.object.position.copy(this.baseCameraPosition)

		this.camera = camera

		this.navigator = new Navigator(this.engine, this.object, this.cameraTarget, this.target, this.gui)

		this.easing = bezier(0.5, 0, 0.5, 1)

		this.range = {
			min: -1,
			max: 1
		}
		this.activeZone = {
			min: 0.5,
			max: 1
		}
		this.cameraTargetLerped = 0

		this.gui.controls
			.addInput(this, 'free', {
				label: 'Free mouvement'
			})
			.on('change', (_e) => {
				this.enabled = _e.value
			})

		this.targetInputs()
		this.cursorInputs()
		this.cameraInputs()

		this._onMouseMove = this.onMouseMove.bind(this)
		this._onPointerMove = this.onPointerMove.bind(this)

		this.pointer = new THREE.Vector2()
		this.pointerLerped = new THREE.Vector2()
		window.addEventListener('mousemove', this._onMouseMove)
		this.addEventListener('change', () => {
			this.posInput.refresh()
			this.tarInput.refresh()
		})
	}

	targetInputs() {
		this.gui.controls.addSeparator()
		this.tarInput = this.gui.controls.addInput(this, 'target', {
			label: 'Target position'
		})

		this.gui.controls
			.addBlade({
				view: 'cubicbezier',
				value: [0.5, 0, 0.5, 1],
				expanded: true,
				presetKey: 'ease_key',
				picker: 'inline',
				label: 'Target position ease'
			})
			.on('change', (ev) => {
				this.easing = bezier(ev.value.x1, ev.value.y1, ev.value.x2, ev.value.y2)
			})

		this.gui.controls.addInput(this, 'targetSpeed', {
			label: 'Target speed',
			min: 0,
			max: 0.1,
			step: 0.001
		})
		this.gui.controls.addInput(this, 'cameraTargetInterpolation', {
			label: 'Target interpolation',
			min: 0.001,
			max: 0.5,
			step: 0.001
		})
	}

	cameraInputs() {
		this.gui.controls.addSeparator()
		this.posInput = this.gui.controls.addInput(this.object, 'position', {
			label: 'Camera position'
		})
		this.gui.controls.addInput(this, 'baseCameraPosition', {
			label: 'Camera default position'
		})
		this.gui.controls.addInput(this, 'range', {
			label: 'Camera range',
			min: -10,
			max: 10,
			step: 1
		})

		this.gui.controls.addInput(this, 'cameraInterpolation', {
			label: 'Camera interpolation',
			min: 0.001,
			max: 0.5,
			step: 0.001
		})
	}

	cursorInputs() {
		this.gui.controls.addSeparator()

		this.gui.controls.addInput(this, 'cursorInterpolation', {
			label: 'Cursor interpolation',
			min: 0.001,
			max: 0.5,
			step: 0.001
		})

		this.gui.controls.addInput(this, 'activeZone', {
			label: 'Cursor zone range',
			min: 0,
			max: 1,
			step: 0.05
		})
	}

	onMouseMove(_e) {
		// calculate pointer position in normalized device coordinates
		// (-1 to +1) for both components

		this.pointer.x = (_e.clientX / this.engine.viewport.width) * 2 - 1
		this.pointer.y = -(_e.clientY / this.engine.viewport.height) * 2 + 1
	}

	onPointerMove(_e) {
		this.pointer.x = (_e.clientX / this.engine.viewport.width) * 2 - 1
		this.pointer.y = -(_e.clientY / this.engine.viewport.height) * 2 + 1
	}

	onChangeEnabled(_e) {
		this.enabled = _e
	}

	getPointerDelta(targetSpeed = 0.01) {
		if (this.pointer.x > this.activeZone.min) {
			return normalize(this.activeZone.min, this.activeZone.max, this.pointer.x) * targetSpeed
		} else if (this.pointer.x < -this.activeZone.min) {
			return normalize(this.activeZone.min, this.activeZone.max, Math.abs(this.pointer.x)) * targetSpeed * -1
		} else return 0
	}

	updateControls() {
		//this.update()
		this.pointerLerped.lerp(this.pointer, this.cursorInterpolation)
		this.time++
		if (!this.free && !this.navigator.enabled) {
			this.lerpCamera()
		} else {
			this.update()
		}

		if (!this.free && this.navigator.lerpTarget) {
			this.lerpTarget()
		}

		if (!this.free) this.camera.lookAt(this.cameraTarget.lerp(this.target, this.navigator.resetting ? 0.08 : 0.1))
	}

	lerpCamera() {
		// base y = this.baseCameraPosition.y + this.pointerLerped.y / 8
		// base x = this.target.x - this.pointerLerped.x / 2
		const target = new THREE.Vector3(
			THREE.MathUtils.mapLinear(
				this.target.x - this.pointerLerped.x,
				this.baseCameraPosition.x + (-4),
				this.baseCameraPosition.x + 4,
				this.baseCameraPosition.x + (-4) + 3,
				this.baseCameraPosition.x + 4 - 3
			),
			this.baseCameraPosition.y + this.pointerLerped.y,
			this.baseCameraPosition.z
		)
		this.camera.position.lerp(target, this.cameraInterpolation)
	}

	lerpTarget() {
		if (this.progress >= 0 && this.progress <= 1) {
			this.progress = this.progress + this.getPointerDelta(this.targetSpeed)

			this.cameraTargetLerped = THREE.MathUtils.lerp(
				this.cameraTargetLerped,
				this.progress * (this.range.max - this.range.min) + this.range.min,
				this.cameraTargetInterpolation
			)
			this.target.x = this.baseCameraPosition.x + this.cameraTargetLerped + this.pointerLerped.x / 2
			this.target.y = 0.5
			this.target.z = THREE.MathUtils.lerp(this.target.z, -3, this.cameraTargetInterpolation)
		} else if (this.progress < 0) this.progress = 0
		else this.progress = 1
	}
}
