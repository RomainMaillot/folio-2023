import Vue from 'vue';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Observer from '@/plugins/Observer/Observer.js';

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

/*
	Translate In
	[v-translate-in]

	Options :
	{
		target: ['self', 'childs'] :: 'self'
		trigger: ['self', 'childs'] :: 'self'
		axis: ['x','y'] :: 'y'
		duration: Number :: .4
		distanceFrom: Number :: 100
		distanceTo: Number :: 0
		stagger: Number :: .2
		animateOpacity: Bool :: true
		markers: Bool :: false
		delay: Number :: 0
		ease: String ::  "power1.out"
		startTrigger: String :: "top 80% "
	}
*/

// TODO
// - Add Easing
Vue.directive('translate-in', {
	inserted: (el, binding) => {
		let animationTriggers, animationTweens;
		binding.animationTweens = [];
		binding.animationTriggers = [];

		const defaults = {
			target: 'self',
			trigger: 'self',
			axis: 'y',
			duration: 0.4,
			distanceFrom: 100,
			distanceTo: 0,
			stagger: 0.2,
			animateOpacity: true,
			delay: 0,
			ease: 'power1.out',
			markers: false,
			startTrigger: 'top 80%',
		};
		const options = { ...defaults, ...binding.value };
		const elements = getElements(el, options);

		elements.forEach((loopElement) => {
			const tweenElement = getTweenElement(loopElement, options);
			const from = getFrom(options);
			const to = getTo(options, tweenElement);

			animationTriggers = ScrollTrigger.create({
				trigger: options.trigger == 'childs' ? loopElement : el,
				once: true,
				start: options.startTrigger,
				markers: options.markers,
				onEnter: () => {
					animationTweens = gsap.fromTo(tweenElement, from, to);
					binding.animationTweens.push(animationTweens);
				},
			});

			binding.animationTriggers.push(animationTriggers);
		});

		function getElements(el, options) {
			if (options.target == 'self' || (options.target == 'childs' && options.trigger == 'self')) {
				return [el];
			}

			if (options.target == 'childs') {
				return Array.from(el.children);
			}
		}

		function getTweenElement(loopElement, options) {
			if (options.trigger == options.target) {
				return loopElement;
			} else {
				return Array.from(loopElement.children);
			}
		}

		function getFrom(options) {
			const from = {};
			from[options.axis] = options.distanceFrom;
			if (options.animateOpacity) from.opacity = 0;
			return from;
		}

		function getTo(options, tweenElement) {
			const to = {};
			to[options.axis] = options.distanceTo;
			to.duration = options.duration;
			to.delay = options.delay;
			to.ease = options.ease;
			to.onCompleteParams = [tweenElement];
			to.force3D = true;

			if (options.animateOpacity) to.opacity = 1;
			if (options.target == 'childs' && options.trigger == 'self') to.stagger = options.stagger;

			return to;
		}
	},
	unbind: (el, binding) => {
		binding.animationTweens?.forEach((tween) => {
			tween.kill();
		});
		binding.animationTriggers?.forEach((trigger) => {
			trigger.kill();
		});
	},
});

Vue.directive('split-text', {
	bind: (el, binding) => {
		// Init
		if (!window.splitTexts) {
			window.splitTexts = [];
		}

		// Get root style
		const rootStyle = getComputedStyle(document.documentElement);

		// Get delay
		const delay = binding.value && binding.value.delay ? parseFloat(binding.value.delay) : 0;
		let delayComplete = 0;

		// Get split type
		const splitType = binding.value && binding.value.type ? binding.value.type : rootStyle.getPropertyValue('--split-type');

		// Add anim class
		el.classList.add('anim--split');

		// Intersection callback
		function onIntersect(observer) {
			if (observer.isIntersecting) {
				gsap.delayedCall(delay, () => {
					if (el) {
						onStart(); // callback onStart
						el.classList.add('anim--split--in');
						gsap.delayedCall(delayComplete, onComplete); // callback onComplete
					}
				});
			}
		}

		// onStart callback
		function onStart() {}

		// onComplete callback
		function onComplete() {}

		// Check if font is loaded before splitting
		if (document.fonts.status == 'loaded') {
			iniSplitText();
		} else {
			checkIfLoaded();
			function checkIfLoaded() {
				if (document.fonts.status != 'loaded') {
					window.requestAnimationFrame(checkIfLoaded);
				} else {
					iniSplitText();
				}
			}
		}

		function iniSplitText() {
			// Split
			const mySplitText = new SplitText(el, {
				type: splitType.includes('line') ? 'words, lines' : `${splitType}, lines`,
				wordsClass: 'anim--split__word',
				linesClass: 'anim--split__line',
				charsClass: 'anim--split__char',
			});
			const lines = mySplitText.lines;
			const words = mySplitText.words;
			const chars = mySplitText.chars;

			if (splitType.includes('line')) {
				lines.forEach((line, index) => {
					const words = line.querySelectorAll('.anim--split__word');
					words.forEach((word) => {
						word.style.setProperty('--split-index', index);
					});
				});
			} else {
				words.forEach((word, index) => {
					word.style.setProperty('--split-index', index);
				});
			}
			chars.forEach((char, index) => {
				char.style.setProperty('--split-index', index);
			});

			// Get delay for onComplete callback
			const animDuration = parseFloat(rootStyle.getPropertyValue('--split-duration'));
			const animStagger = splitType.includes('char')
				? parseFloat(rootStyle.getPropertyValue('--split-stagger-char'))
				: parseFloat(rootStyle.getPropertyValue('--split-stagger-word'));

			if (splitType.includes('line')) {
				delayComplete = animDuration + (lines.length - 1) * animStagger;
			} else if (splitType.includes('word')) {
				delayComplete = animDuration + (words.length - 1) * animStagger;
			} else if (splitType.includes('char')) {
				delayComplete = animDuration + (chars.length - 1) * animStagger;
			}

			// Intersection Observer push
			window.splitTexts.push(
				new Observer(el, {
					rootMargin: `0px 0px -20% 0px `,
					onIntersect: onIntersect,
					once: true,
				})
			);
		}
	},
	unbind: (el) => {
		if (window.splitTexts) {
			for (let i = 0; i < window.splitTexts.length; i++) {
				if (window.splitTexts[i] && window.splitTexts[i].destroy()) {
					window.splitTexts[i].destroy();
					window.splitTexts[i] = null;
				}
			}
			window.splitTexts = null;
		}
	},
});

/*
  Parallax
  [v-parallax]
*/
Vue.directive('parallax', {
	bind: (el, binding) => {
		if (!window.parallaxes) {
			window.parallaxes = [];
		}

		// Get amplitude
		const amplitude = binding.value && binding.value.amplitude ? parseFloat(binding.value.amplitude) : 100;
		const rotation = binding.value && binding.value.rotation ? parseFloat(binding.value.rotation) : 0;

		gsap.delayedCall($nuxt.$store.state.app.loaderOut, () => {
			const parallax = gsap.fromTo(
				el,
				{
					y: amplitude * 0.5,
					rotation: -rotation * 0.5,
				},
				{
					y: -amplitude * 0.5,
					rotation: rotation * 0.5,
					force3D: true,
					ease: 'none',
					scrollTrigger: {
						trigger: el,
						scrub: 1.5,
					},
				}
			);

			window.parallaxes.push(parallax);
		});
	},
	unbind: (el) => {
		if (window.parallaxes) {
			for (let i = 0; i < window.parallaxes.length; i++) {
				if (window.parallaxes[i] && window.parallaxes[i].kill()) {
					window.parallaxes[i].kill();
					window.parallaxes[i] = null;
				}
			}
			window.parallaxes = null;
		}
	},
});
