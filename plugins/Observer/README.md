# Observer

## Use as a class

#### JS

##### Import the plugin

```js
import Observer from '@/plugins/Observer/Observer.js'

const observer = new Observer(element, options)
```

### Observer

Observer wichever element you want by simply passing its reference or its class

```js
import Observer from '@/plugins/Observer/Observer.js'

const observer = new Observer('.myElement', {
	onIntersect: myCallback
})
```

_Note: If your are using Nuxt or Vue, it is preferable to use this.$refs or this.$el directly instead of a selector._

## Use as a directive

```js
import Observer from '@/plugins/Observer/Observer.js'
```

```html
<div v-observer="{onIntersect: myCallback, ...}">...</div>
```

## Observer element

The first parameter of the Observer is the element to watch; If you already have the DOM element reference you can pass it directly, else you can juste pass a selector as a string. If no element is passed or if no element is found, the Observer will not be created.

## Observer options

| Options         | Type                            | Default           | Description                                                                                 |
| --------------- | ------------------------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `root`          | `Element`                       | `window`          | [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) |
| `rootMargin`    | `String`                        | `0px 0px 0px 0px` | [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) |
| `threshold`     | `String` or `Array` or `Number` | `0`               | [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) |
| `once`          | `Boolean`                       | `false`           | Trigger only once                                                                           |
| `autoResize`    | `Boolean`                       | `true`            | Set to false if you want to handle the resize yourself with `observer.resize()` method      |
| `onIntersect`   | `Function`                      | `none`            | Triggers when the element enters the viewport                                               |
| `onVisible`     | `Function`                      | `none`            | Triggers when the element is fully in viewport                                              |
| `onEnter`       | `Function`                      | `none`            | Triggers when element enters the viewport                                                   |
| `onLeave`       | `Function`                      | `none`            | Triggers when element leaves the viewport                                                   |
| `onDestroyOnce` | `Function`                      | `none`            | Triggers when element is destroyed after entering the viewport once                         |
| `onDestroy`     | `Function`                      | `none`            | Triggers when the observer is destroyed                                                     |

## Observer methods

| Options     | Description                                                    | Arguments |
| ----------- | -------------------------------------------------------------- | --------- |
| `resize()`  | `Handle observer resizes and updates the observer rootMargins` |           |
| `destroy()` | `Destroy the observer & puts it available for GC`              |           |
