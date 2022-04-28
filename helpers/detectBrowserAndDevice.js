const detectBrowserAndDevice = (instance) => {
	// Browsers
	if (instance.$device.isFirefox) {
		document.body.classList.add('firefox');
	} else if (instance.$device.isSafari) {
		document.body.classList.add('safari');
	}

	// Devices
	if (
		instance.$device.isTablet ||
		navigator.userAgent.includes('iPad') ||
		(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0)
	) {
		document.body.classList.add('tablet');
	} else if (instance.$device.isDesktop) {
		document.body.classList.add('desktop');
	} else if (instance.$device.isMobile) {
		document.body.classList.add('mobile');
	}
};

export default detectBrowserAndDevice;
