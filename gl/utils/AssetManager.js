import { FileLoader, LoadingManager, TextureLoader, UnsignedByteType } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Interface from '~/gl/utils/Interface'
let dracoLoader = null
if (process.client) dracoLoader = new DRACOLoader().setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/').preload()

export class AssetManager extends Interface {
	constructor() {
		super()
		this.assets = new Map()
	}

	load(files = []) {
		let resolvedFiles = 0
		return new Promise((resolve, reject) => {
			const loadingManager = this.getNewLoader()
			loadingManager.onError = reject

			loadingManager.loader.onLoad = () => {
				this.$emit('loaded', this.assets)
				resolve(this.assets)
			}

			loadingManager.loader.onProgress = (url, itemsLoaded, itemsTotal) => {
				this.$emit('progress', (itemsLoaded / itemsTotal) * 100)
			}
			if (files.length === 0) resolve(null)

			files.forEach((file, index) => {
				const ext = file.url.slice(((file.url.lastIndexOf('.') - 1) >>> 0) + 2)

				if (typeof this.assets.get(file.key) !== 'undefined') {
					resolvedFiles++
					if (index === files.length - 1 && resolvedFiles === files.length) resolve(null)
				} else {
					this.loadTextures(ext, loadingManager, file)
					this.loadGLTF(ext, loadingManager, file)
					this.loadFBX(ext, loadingManager, file)
					this.loadHDR(ext, loadingManager, file)
					this.loadJSON(ext, loadingManager, file)
					this.loadSounds(ext, file)
				}
			})
		})
	}

	loadTextures(ext, loader, file) {
		if (['png', 'jpg', 'jpeg'].includes(ext)) {
			loader.textureLoader.load(file.url, (texture) => {
				this.assets.set(file.key, texture)
			})
		}
	}

	loadGLTF(ext, loader, file) {
		if (['gltf', 'glb'].includes(ext)) {
			loader.gltfLoader.load(file.url, (model) => {
				model.scene.traverse(function (object) {
					if (object.isMesh) {
						object.castShadow = true
						object.receiveShadow = true
					}
				})
				this.assets.set(file.key, model)
			})
		}
	}

	loadFBX(ext, loader, file) {
		if (['fbx'].includes(ext)) {
			loader.fbxLoader.load(file.url, (model) => {
				this.assets.set(file.key, model)
			})
		}
	}

	loadHDR(ext, loader, file) {
		if (['hdr'].includes(ext)) {
			loader.rgbeLoader.load(file.url, async (hdr) => {
				this.assets.set(file.key, hdr)
			})
		}
	}

	loadJSON(ext, loader, file) {
		loader.fileLoader.setResponseType('json')
		if (['json'].includes(ext)) {
			loader.fileLoader.load(file.url, async (json) => {
				this.assets.set(file.key, json)
			})
		}
	}

	loadSounds(ext, file) {
		if (['mp4', 'webm'].includes(ext)) {
			this.assets.set(file.key, file.url)
		}
	}

	getNewLoader() {
		const loader = new LoadingManager()

		return {
			loader: loader,
			textureLoader: new TextureLoader(loader),
			rgbeLoader: new RGBELoader(loader).setDataType(UnsignedByteType),
			fileLoader: new FileLoader(loader),
			gltfLoader: new GLTFLoader(loader).setDRACOLoader(dracoLoader),
			fbxLoader: new FBXLoader(loader),
			onError: (e) => console.error(e)
		}
	}

	get(key) {
		return this.assets.get(key)
	}

	destroy() {
		this.assets = new Map()
	}
}

const AssetManagerInstance = new AssetManager()
export default AssetManagerInstance
