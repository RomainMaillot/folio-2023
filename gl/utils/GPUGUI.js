import { getGPUTier } from 'detect-gpu'
export default class GPUGUI {
	constructor(pane) {
		this.pane = pane
		this.gpu = this.pane.addFolder({
			title: 'GPU',
			expanded: false
		})

		this.gpuTab = this.gpu.addTab({
			pages: [{ title: 'Basic' }, { title: 'Advanced' }]
		})

		this.gpuTier()
	}

	async gpuTier() {
		const gpuTier = await getGPUTier()
		let info = {
			gpu: JSON.stringify(gpuTier, null, 2)
		}

		this.gpuTab.pages[0].addMonitor(gpuTier, 'tier')
		this.gpuTab.pages[0].addMonitor(gpuTier, 'gpu')
		this.gpuTab.pages[1].addMonitor(info, 'gpu', {
			multiline: true,
			lineCount: 7
		})
	}
}
