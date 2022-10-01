import Interface from '~/gl/utils/Interface'
export default class PresetExporter extends Interface {
	constructor(pane) {
		super()
		if (!process.client) return
		this.preset = ''
		this.currentPreset = ''
		this.pane = pane
		this.createExporter()
	}

	createExporter() {
		this.export = this.pane.addFolder({
			title: 'Export/Import',
			expanded: false
		})

		this.textPresetInput = this.export.addInput(this, 'currentPreset').on('change', (_e) => {
			if (_e.value !== '') this.preset = JSON.parse(_e.value)
		})
		this.buttonImport = this.export.addButton({
			title: 'Import'
		})

		this.buttonImport.on('click', () => {
			this.pane.importPreset(this.preset)
			this.preset = ''
			this.currentPreset = ''
			this.textPresetInput.refresh()
		})

		this.export.addSeparator()

		this.buttonExport = this.export.addButton({
			title: 'Export'
		})

		this.buttonExport.on('click', () => {
			const preset = this.pane.exportPreset()
			console.log(preset)
			for (const key in preset) {
				if (Object.hasOwnProperty.call(preset, key)) {
					const element = preset[key]
					if (key === 'position' || key === 'target') delete preset[key]
				}
			}
			delete preset.preset
			navigator.clipboard.writeText(JSON.stringify(preset))
		})
	}
}
