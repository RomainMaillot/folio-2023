const debounce = (func, wait, immediate = false) => {
	let timeout

	return function () {
		// @ts-ignore
		let context = this,
			args = arguments

		let later = function () {
			timeout = null

			// @ts-ignore
			if (!immediate) func.apply(context, args)
		}

		let callNow = immediate && !timeout

		clearTimeout(timeout)

		// @ts-ignore
		timeout = setTimeout(later, wait)

		// @ts-ignore
		if (callNow) func.apply(context, args)
	}
}

export default debounce
