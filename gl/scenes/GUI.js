import { Pane } from 'tweakpane'
import * as TweakpaneImagePlugin from 'tweakpane-image-plugin'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import * as CamerakitPlugin from '@tweakpane/plugin-camerakit'
import Interface from '~/gl/utils/Interface'
import GPUGUI from '~/gl/utils/GPUGUI'
import PresetExporter from '~/gl/utils/PresetExporter'

export default class GUI extends Interface {
	constructor() {
		super()
		if (!process.client) return
		this.preset = ''
		this.currentPreset = ''

		this.pane = new Pane({
			title: '3D Template',
			expanded: true,
			hidden: true
		})
		this.pane.registerPlugin(TweakpaneImagePlugin)
		this.pane.registerPlugin(EssentialsPlugin)
		this.pane.registerPlugin(CamerakitPlugin)

		this.general = this.pane.addFolder({
			title: 'General'
		})

		this.post = this.pane.addFolder({
			title: 'Post Proccessing',
			expanded: false
		})

		this.camera = this.pane.addFolder({
			title: 'Camera',
			expanded: false
		})

		this.controls = this.pane.addFolder({
			title: 'Controls',
			expanded: false
		})

		this.lights = this.pane.addFolder({
			title: 'Lights',
			expanded: false
		})

		this.dust = this.pane.addFolder({
			title: 'Dust',
			expanded: false
		})

		this.godray = this.pane.addFolder({
			title: 'GodRay',
			expanded: false
		})

		this.navigator = this.pane.addFolder({
			title: 'Navigation',
			expanded: false
		})

		this.debug = this.pane.addFolder({
			title: 'Debug',
			expanded: false
		})

		this.gpu = new GPUGUI(this.pane)

		this.textureChanger()

		this.exporter = new PresetExporter(this.pane)
	}

	textureChanger() {
		this.texturer = this.pane.addFolder({
			title: 'Texturer',
			expanded: false,
			hidden: true
		})
	}

	destroy() {
		this.pane.dispose()
	}
}
