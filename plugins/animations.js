import Vue from 'vue';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
			duration: 3,
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
			if (
				options.target == 'self' ||
				(options.target == 'childs' && options.trigger == 'self')
			) {
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
			if (options.target == 'childs' && options.trigger == 'self')
				to.stagger = options.stagger;

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
