import { getGPUTier } from 'detect-gpu';

export const checkGPU = () => {
	return new Promise(async (resolve) => {
		const gpuTier = await getGPUTier();
		resolve(gpuTier);
	});
};
