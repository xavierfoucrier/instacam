(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Instacam", [], factory);
	else if(typeof exports === 'object')
		exports["Instacam"] = factory();
	else
		root["Instacam"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/instacam.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/defaults.js":
/*!*************************!*\
  !*** ./src/defaults.js ***!
  \*************************/
/*! exports provided: defaults */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"defaults\", function() { return defaults; });\n\n\n// default options\nlet defaults = {\n\n  // {Number} width of the viewport element\n  width: 400,\n\n  // {Number} height of the viewport element\n  height: 300,\n\n  // {Boolean} true|false, defines if the camera video stream is enabled\n  camera: true,\n\n  // {Number} refresh rate in frames per second of the camera video stream\n  framerate: 30,\n\n  // {Number} ratio of the camera video stream\n  ratio: 4 / 3,\n\n  // {Boolean} true|false, defines if the camera audio stream is enabled\n  sound: false,\n\n  // {Number} [0..100] volume of the camera audio stream\n  volume: 100,\n\n  // {Boolean} true|false, mirror mode of the viewport (css transform)\n  mirror: false,\n\n  // {Number} [0..1] opacity of the viewport (css)\n  opacity: 1,\n\n  // {Number} [0..*] brightness of the viewport (css filter)\n  brightness: 1,\n\n  // {Number} [0..*] contrast of the viewport (css filter)\n  contrast: 1,\n\n  // {Number} [0..*] saturation of the viewport (css filter)\n  saturation: 0,\n\n  // {Number} [0..360] hue of the viewport (css filter)\n  hue: 0,\n\n  // {Number} [0..1] inverts the color of the viewport (css filter)\n  invert: 0,\n\n  // {Number} [0..1] grayscale of the viewport (css filter)\n  grayscale: 0,\n\n  // {Number} [0..1] sepia of the viewport (css filter)\n  sepia: 0,\n\n  // {Number} [0..*] blur of the viewport (css filter)\n  blur: 0,\n\n  // {String} svg filtering of the viewport (css filter)\n  url: '',\n\n  // {Function} custom filter applied to the viewport\n  filter: null,\n\n  // {Function} callback's method used when the stream is fully captured\n  done: null,\n\n  // {Function} callback's method used when the stream capture fails\n  fail: null,\n\n  // {Function} callback's method used when a browser doesn't support the requirements\n  unsupported: null\n};\n\n\n//# sourceURL=webpack://Instacam/./src/defaults.js?");

/***/ }),

/***/ "./src/instacam.js":
/*!*************************!*\
  !*** ./src/instacam.js ***!
  \*************************/
/*! exports provided: Instacam */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Instacam\", function() { return Instacam; });\n/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaults.js */ \"./src/defaults.js\");\n/* harmony import */ var _support_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./support.js */ \"./src/support.js\");\n\n\n\n\n\nclass Instacam {\n\n  /**\n    Class constructor\n    @param {Object} viewport - canvas element from the DOM\n    @param {Object} options - custom options of the class\n  */\n  constructor(viewport, options) {\n\n    // assigns custom user options to defaults\n    this.options = Object.assign({}, _defaults_js__WEBPACK_IMPORTED_MODULE_0__[\"defaults\"], options);\n\n    // checks for browser support\n    if (!_support_js__WEBPACK_IMPORTED_MODULE_1__[\"requirement\"]) {\n      if (typeof this.options.unsupported === 'function') {\n        this.options.unsupported();\n      }\n\n      return;\n    }\n\n    // checks the viewport element\n    if (typeof viewport === 'undefined' || viewport === null || viewport.nodeName.toLowerCase() !== 'canvas') {\n      throw new Error('Invalid viewport, you need to pass a valid HTML5 canvas element');\n    }\n\n    // initializes the viewport\n    this.viewport = viewport;\n    this.viewport.width = this.options.width;\n    this.viewport.height = this.options.height;\n\n    // creates the media element\n    this.media = document.createElement('video');\n\n    // sets some media element properties\n    this.media.style.display = 'none';\n    this.media.autoplay = true;\n    this.media.width = this.options.width;\n    this.media.height = this.options.height;\n\n    // attaches the media element to the DOM\n    this.viewport.parentNode.insertBefore(this.media, this.viewport.nextSibling);\n\n    // applies the css mirror mode on the viewport\n    this.mirror = this.options.mirror;\n\n    // computes the css filter options\n    this._compute();\n\n    // captures the webcam stream\n    this._capture();\n  }\n\n  /**\n    Captures the media stream to the viewport through getUserMedia API\n  */\n  _capture() {\n\n    // prevents from streaming errors\n    try {\n\n      // captures the media stream\n      navigator.mediaDevices.getUserMedia({\n        audio: this.options.sound,\n        video: (() => {\n          if (this.options.camera === false) {\n            return false;\n          }\n\n          return {\n            frameRate: this.options.framerate,\n            aspectRatio: this.options.ratio\n          };\n        })()\n      }).then((stream) => {\n\n        // captures the blob stream\n        this.media.srcObject = stream;\n\n        // sets the volume at start\n        this.volume = this.options.volume;\n\n        // animation loop used to properly render the viewport\n        const loop = () => {\n\n          // renders the viewport with or without custom filter\n          if (typeof this.options.filter !== 'function') {\n            this.viewport.getContext('2d').drawImage(this.media, 0, 0, this.options.width, this.options.height);\n          } else {\n\n            // uses a buffer when applying a custom filter to prevent the viewport from blinkings or flashes\n            if (typeof this._buffer === 'undefined') {\n              this._buffer = document.createElement('canvas');\n              this._buffer.style.display = 'none';\n              this._buffer.width = this.options.width;\n              this._buffer.height = this.options.height;\n              this.viewport.parentNode.insertBefore(this._buffer, this.viewport.nextSibling);\n            }\n\n            this._buffer.getContext('2d').drawImage(this.media, 0, 0, this.options.width, this.options.height);\n            this.viewport.getContext('2d').putImageData(this._filter(this._buffer.getContext('2d').getImageData(0, 0, this.options.width, this.options.height)), 0, 0);\n          }\n\n          // makes this function run at 60fps\n          requestAnimationFrame(loop);\n        };\n\n        // renders the first frame\n        requestAnimationFrame(loop);\n\n        if (typeof this.options.done === 'function') {\n          this.options.done();\n        }\n      }).catch((exception) => {\n        if (typeof this.options.fail === 'function') {\n          this.options.fail(exception);\n        }\n      });\n    } catch(exception) {\n      if (typeof this.options.fail === 'function') {\n        this.options.fail(exception);\n      }\n    }\n  }\n\n  /**\n    Computes and applies the css filter effects to the viewport\n  */\n  _compute() {\n\n    // builds the css layer depending on the options\n    this._style = this.options.opacity !== _defaults_js__WEBPACK_IMPORTED_MODULE_0__[\"defaults\"].opacity ? `opacity(${this.options.opacity}) ` : '';\n    this._style += this.options.brightness !== _defaults_js__WEBPACK_IMPORTED_MODULE_0__[\"defaults\"].brightness ? `brightness(${this.options.brightness}) ` : '';\n    this._style += this.options.contrast !== _defaults_js__WEBPACK_IMPORTED_MODULE_0__[\"defaults\"].contrast ? `contrast(${this.options.contrast}) ` : '';\n    this._style += this.options.saturation !== _defaults_js__WEBPACK_IMPORTED_MODULE_0__[\"defaults\"].saturation ? `saturate(${this.options.saturation}) ` : '';\n    this._style += this.options.hue !== _defaults_js__WEBPACK_IMPORTED_MODULE_0__[\"defaults\"].hue ? `hue-rotate(${this.options.hue}deg) ` : '';\n    this._style += this.options.invert !== _defaults_js__WEBPACK_IMPORTED_MODULE_0__[\"defaults\"].invert ? `invert(${this.options.invert}) ` : '';\n    this._style += this.options.grayscale !== _defaults_js__WEBPACK_IMPORTED_MODULE_0__[\"defaults\"].grayscale ? `grayscale(${this.options.grayscale}) ` : '';\n    this._style += this.options.sepia !== _defaults_js__WEBPACK_IMPORTED_MODULE_0__[\"defaults\"].sepia ? `sepia(${this.options.sepia}) ` : '';\n    this._style += this.options.blur !== _defaults_js__WEBPACK_IMPORTED_MODULE_0__[\"defaults\"].blur ? `blur(${this.options.blur}px) ` : '';\n    this._style += this.options.url !== _defaults_js__WEBPACK_IMPORTED_MODULE_0__[\"defaults\"].url ? `url(${this.options.url}) ` : '';\n\n    // applies the css filter effects to the viewport\n    this.viewport.style.filter = this._style;\n  }\n\n  /**\n    Applies a custom filter to the viewport\n    @param {Object} image - image object from the canvas element\n    @returns {Object} image data object containing pixels informations\n  */\n  _filter(image) {\n\n    // gets the image data\n    let data = image.data;\n\n    // prevents from filtering errors\n    try {\n\n      // loops through all pixels and applies the filter\n      for (let y = 0; y < this.options.height; y++) {\n        for (let x = 0; x < this.options.width; x++) {\n\n          // detects the pixel offset\n          const offset = ((this.options.width * y) + x) * 4;\n\n          // calls the filter\n          const filter = this.options.filter({\n            'offset': offset,\n            'x': x,\n            'y': y,\n            'red': data[offset],\n            'green': data[offset + 1],\n            'blue': data[offset + 2],\n            'alpha': data[offset + 3]\n          });\n\n          // applies the filter\n          data[offset] = filter[0];\n          data[offset + 1] = filter[1];\n          data[offset + 2] = filter[2];\n          data[offset + 3] = filter[3];\n        }\n      }\n\n      return image;\n    } catch(exception) {\n      throw new Error('Invalid filter, you need to return a valid [red, green, blue, alpha] pixel array');\n    }\n  }\n\n  /**\n    Snaps and crops the viewport to return image data\n    @param {Number} left - left position of the snapping area\n    @param {Number} top - top position of the snapping area\n    @param {Number} width - width of the snapping area\n    @param {Number} height - height of the snapping area\n    @returns {Object} image data object containing pixels informations\n  */\n  snap(left = 0, top = 0, width = this.options.width, height = this.options.height) {\n\n    // checks the snap size area\n    if (width <= 0 || height <= 0) {\n      throw new Error('Invalid snap area, you need to specify a positive width and height for your image capture');\n    }\n\n    return this.viewport.getContext('2d').getImageData(left, top, width, height);\n  }\n\n  /**\n    Saves the viewport to a specific image file format\n    @param {String} format - png|jpeg|webp image file format\n    @param {Number} quality - [0..1] image quality\n    @returns {String} UTF-16 data image URI (DOMString)\n  */\n  save(format = 'png', quality = 1) {\n    return this.viewport.toDataURL('image/' + format, quality);\n  }\n\n  /**\n    Gets the camera volume\n    @returns {Number} [0..100] volume of the camera audio stream\n  */\n  get volume() {\n    return this.options.volume;\n  }\n\n  /**\n    Sets the camera volume\n    @param {Number} volume - [0..100] volume of the camera audio stream\n  */\n  set volume(volume) {\n    if (typeof volume !== 'number' || volume < 0 || volume > 100) {\n      throw new Error('Invalid volume, you need to give a number between 0 and 100');\n    }\n\n    this.media.volume = this.options.volume = volume / 100;\n  }\n\n  /**\n    Gets the camera mirror mode\n    @returns {Boolean} true|false, mirror mode of the viewport (css transform)\n  */\n  get mirror() {\n    return this.options.mirror;\n  }\n\n  /**\n    Sets the camera mirror mode\n    @param {Boolean} mirror - true|false, mirror mode of the viewport (css transform)\n  */\n  set mirror(mirror) {\n    if (typeof mirror !== 'boolean') {\n      throw new Error('Invalid mirror mode, you need to give a boolean to enable or disable the mirror mode');\n    }\n\n    let transform = getComputedStyle(this.viewport).getPropertyValue('transform');\n    transform = transform !== 'none' ? transform : '';\n\n    this.viewport.style.transform = mirror === true ? `${transform} scale(-1, 1)` : '';\n    this.options.mirror = mirror;\n  }\n\n  /**\n    Gets the viewport opacity\n    @returns {Number} [0..1] opacity of the viewport (css)\n  */\n  get opacity() {\n    return this.options.opacity;\n  }\n\n  /**\n    Sets the viewport opacity\n    @param {Number} opacity - [0..1] opacity of the viewport (css)\n  */\n  set opacity(opacity) {\n    if (typeof opacity !== 'number' || opacity < 0 || opacity > 1) {\n      throw new Error('Invalid opacity, you need to give a number between 0 and 1');\n    }\n\n    this.options.opacity = opacity;\n    this._compute();\n  }\n\n  /**\n    Gets the viewport brightness\n    @returns {Number} [0..*] brightness of the viewport (css filter)\n  */\n  get brightness() {\n    return this.options.brightness;\n  }\n\n  /**\n    Sets the viewport brightness\n    @param {Number} brightness - [0..*] brightness of the viewport (css filter)\n  */\n  set brightness(brightness) {\n    if (typeof brightness !== 'number' || brightness < 0) {\n      throw new Error('Invalid brightness, you need to give a number above 0');\n    }\n\n    this.options.brightness = brightness;\n    this._compute();\n  }\n\n  /**\n    Gets the viewport contrast\n    @returns {Number} [0..*] contrast of the viewport (css filter)\n  */\n  get contrast() {\n    return this.options.contrast;\n  }\n\n  /**\n    Sets the viewport contrast\n    @param {Number} contrast - [0..*] contrast of the viewport (css filter)\n  */\n  set contrast(contrast) {\n    if (typeof contrast !== 'number' || contrast < 0) {\n      throw new Error('Invalid contrast, you need to give a number above 0');\n    }\n\n    this.options.contrast = contrast;\n    this._compute();\n  }\n\n  /**\n    Gets the viewport saturation\n    @returns {Number} [0..*] saturation of the viewport (css filter)\n  */\n  get saturation() {\n    return this.options.saturation;\n  }\n\n  /**\n    Sets the viewport saturation\n    @param {Number} saturation - [0..*] saturation of the viewport (css filter)\n  */\n  set saturation(saturation) {\n    if (typeof saturation !== 'number' || saturation < 0) {\n      throw new Error('Invalid saturation, you need to give a number above 0');\n    }\n\n    this.options.saturation = saturation;\n    this._compute();\n  }\n\n  /**\n    Gets the viewport hue\n    @returns {Number} [0..360] hue of the viewport (css filter)\n  */\n  get hue() {\n    return this.options.hue;\n  }\n\n  /**\n    Sets the viewport hue\n    @param {Number} hue - [0..360] hue of the viewport (css filter)\n  */\n  set hue(hue) {\n    if (typeof hue !== 'number' || hue < 0 || hue > 360) {\n      throw new Error('Invalid hue, you need to give a number between 0 and 360');\n    }\n\n    this.options.hue = hue;\n    this._compute();\n  }\n\n  /**\n    Gets the viewport color inversion\n    @returns {Number} [0..1] inverts the color of the viewport (css filter)\n  */\n  get invert() {\n    return this.options.invert;\n  }\n\n  /**\n    Sets the viewport color inversion\n    @param {Number} invert - [0..1] inverts the color of the viewport (css filter)\n  */\n  set invert(invert) {\n    if (typeof invert !== 'number' || invert < 0 || invert > 1) {\n      throw new Error('Invalid invert, you need to give a number between 0 and 1');\n    }\n\n    this.options.invert = invert;\n    this._compute();\n  }\n\n  /**\n    Gets the viewport grayscale\n    @returns {Number} [0..1] grayscale of the viewport (css filter)\n  */\n  get grayscale() {\n    return this.options.grayscale;\n  }\n\n  /**\n    Sets the viewport grayscale\n    @param {Number} grayscale - [0..1] grayscale of the viewport (css filter)\n  */\n  set grayscale(grayscale) {\n    if (typeof grayscale !== 'number' || grayscale < 0 || grayscale > 1) {\n      throw new Error('Invalid grayscale, you need to give a number between 0 and 1');\n    }\n\n    this.options.grayscale = grayscale;\n    this._compute();\n  }\n\n  /**\n    Gets the viewport sepia\n    @returns {Number} [0..1] sepia of the viewport (css filter)\n  */\n  get sepia() {\n    return this.options.sepia;\n  }\n\n  /**\n    Sets the viewport sepia\n    @param {Number} sepia - [0..1] sepia of the viewport (css filter)\n  */\n  set sepia(sepia) {\n    if (typeof sepia !== 'number' || sepia < 0 || sepia > 1) {\n      throw new Error('Invalid sepia, you need to give a number between 0 and 1');\n    }\n\n    this.options.sepia = sepia;\n    this._compute();\n  }\n\n  /**\n    Gets the viewport blur\n    @returns {Number} [0..*] blur of the viewport (css filter)\n  */\n  get blur() {\n    return this.options.blur;\n  }\n\n  /**\n    Sets the viewport blur\n    @param {Number} blur - [0..*] blur of the viewport (css filter)\n  */\n  set blur(blur) {\n    if (typeof blur !== 'number' || blur < 0) {\n      throw new Error('Invalid blur, you need to give a number above 0');\n    }\n\n    this.options.blur = blur;\n    this._compute();\n  }\n\n  /**\n    Gets the viewport svg filtering\n    @returns {String} svg filtering of the viewport (css filter)\n  */\n  get url() {\n    return this.options.url;\n  }\n\n  /**\n    Sets the viewport svg filtering\n    @param {String} url - svg filtering of the viewport (css filter)\n  */\n  set url(url) {\n    if (typeof url !== 'string') {\n      throw new Error('Invalid url, you need to give a string');\n    }\n\n    this.options.url = url;\n    this._compute();\n  }\n\n  /**\n    Gets the custom filter\n    @returns {Function} custom filter of the viewport\n  */\n  get filter() {\n    return this.options.filter;\n  }\n\n  /**\n    Sets the custom filter\n    @param {Function} filter - custom filter applied to the viewport\n  */\n  set filter(filter) {\n    if (filter !== null && typeof filter !== 'function') {\n      throw new Error('Invalid filter, you need to give a function or null to disable the custom filtering');\n    }\n\n    this.options.filter = filter;\n  }\n}\n\n\n//# sourceURL=webpack://Instacam/./src/instacam.js?");

/***/ }),

/***/ "./src/support.js":
/*!************************!*\
  !*** ./src/support.js ***!
  \************************/
/*! exports provided: requirement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"requirement\", function() { return requirement; });\n\n\n// browser requirement needed for Instacam to properly work\nlet requirement = 'requestAnimationFrame' in window && 'mediaDevices' in navigator && 'Promise' in window;\n\n\n//# sourceURL=webpack://Instacam/./src/support.js?");

/***/ })

/******/ });
});