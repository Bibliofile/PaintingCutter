/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tile */ \"./src/tile.ts\");\n\nconst fileButton = document.querySelector('#file-button');\nconst fileInput = document.querySelector('#input-image');\nconst splitButton = document.querySelector('#split-button');\nconst widthInput = document.querySelector('#input-width');\nconst heightInput = document.querySelector('#input-height');\nconst scaleInput = document.querySelector('#input-scale');\nconst offsetXInput = document.querySelector('#input-offset-x');\nconst offsetYInput = document.querySelector('#input-offset-y');\nconst preview = document.querySelector('#preview');\nconst workItem = document.querySelector('#work-item');\nconst output = document.querySelector('#output');\nconst context = preview.getContext('2d');\nfor (const el of [widthInput, heightInput, scaleInput, offsetXInput, offsetYInput]) {\n    el.addEventListener('input', draw);\n}\nfunction clamp() {\n    for (const el of [widthInput, heightInput, scaleInput]) {\n        el.value = Math.min(+el.value, +el.max).toString();\n    }\n}\nfor (const el of [widthInput, heightInput, scaleInput]) {\n    el.addEventListener('input', clamp);\n}\n// Easels can make square or rectangular photos.\n// The square paintings make images that are\n// 3x3 = 96px\n// 2x2 = 64px\n// 1x1 = 32px\n// in size. The rectangular photos don't get to the edge of\n// the block (small/med/large) so cannot be used for tiling\n// and can be ignored. Further, the 2x2 paintings don't fit\n// exactly with blocks, so any painting made with 2x2 paintings\n// must be made entirely of 2x2 paintings... so I only use 3x3\n// and 1x1 paintings to form the whole painting.\nlet image = new Image();\n// Previously was input, but change also works on WebKit, Gecko, and older versions of Blink.\nfileInput.addEventListener('change', () => {\n    fileButton.classList.add('is-hidden');\n    splitButton.disabled = false;\n    const file = fileInput.files[0];\n    const reader = new FileReader();\n    reader.addEventListener('load', () => {\n        image.src = String(reader.result);\n    });\n    if (file) {\n        reader.readAsDataURL(file);\n    }\n});\nimage.addEventListener('load', () => {\n    widthInput.max = Math.floor(image.width / 32).toString(); // FIXME\n    heightInput.max = Math.floor(image.height / 32).toString();\n    clamp();\n    draw();\n});\nfunction getPaintingRect() {\n    const scale = +scaleInput.value / 100;\n    const blockPixels = Math.min(scale * image.width / +widthInput.value, scale * image.height / +heightInput.value);\n    const paintingWidth = blockPixels * +widthInput.value;\n    const paintingHeight = blockPixels * +heightInput.value;\n    const offsetX = Math.min(image.width - paintingWidth, +offsetXInput.value);\n    const offsetY = Math.min(image.height - paintingHeight, +offsetYInput.value);\n    return { blockPixels, paintingHeight, paintingWidth, offsetX, offsetY };\n}\nfunction draw() {\n    if (!image.width)\n        return;\n    preview.width = image.width;\n    preview.height = image.height;\n    const { blockPixels, offsetX, offsetY } = getPaintingRect();\n    context.drawImage(image, 0, 0);\n    let count = 0;\n    for (const { x, y, w, h } of Object(_tile__WEBPACK_IMPORTED_MODULE_0__[\"tile\"])(+widthInput.value, +heightInput.value)) {\n        context.font = \"50px sans-serif\";\n        context.fillText(String(++count), x * blockPixels + offsetX, y * blockPixels + offsetY + 50);\n        context.strokeRect(x * blockPixels + offsetX, y * blockPixels + offsetY, w * blockPixels, h * blockPixels);\n    }\n}\ndocument.querySelector('button').addEventListener('click', () => {\n    const { blockPixels, offsetX, offsetY } = getPaintingRect();\n    while (output.firstChild)\n        output.firstChild.remove();\n    const context = workItem.getContext('2d');\n    let count = 0;\n    for (const { x, y, w, h } of Object(_tile__WEBPACK_IMPORTED_MODULE_0__[\"tile\"])(+widthInput.value, +heightInput.value)) {\n        workItem.width = w * blockPixels;\n        workItem.height = h * blockPixels;\n        context.drawImage(image, x * blockPixels + offsetX, y * blockPixels + offsetY, w * blockPixels, h * blockPixels, 0, 0, w * blockPixels, h * blockPixels);\n        const column = document.createElement('div');\n        column.classList.add('column');\n        const label = document.createElement('strong');\n        label.textContent = `Painting ${++count}`;\n        column.appendChild(label);\n        const item = new Image();\n        item.src = workItem.toDataURL();\n        item.classList.add('output-image');\n        column.appendChild(item);\n        output.appendChild(column);\n    }\n});\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/tile.ts":
/*!*********************!*\
  !*** ./src/tile.ts ***!
  \*********************/
/*! exports provided: transpose, tile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transpose\", function() { return transpose; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"tile\", function() { return tile; });\nfunction* transpose(data) {\n    for (const { x: y, y: x, w: h, h: w } of data) {\n        yield { x, y, w, h };\n    }\n}\nfunction* tile(width, height) {\n    for (let y = 0; y < height - 2; y += 3) {\n        for (let x = 0; x < width - 2; x += 3) {\n            yield { x, y, w: 3, h: 3 };\n        }\n    }\n    for (let y = 0; y < height; y++) {\n        for (let x = 0; x < width; x++) {\n            if (x >= width - width % 3 || y >= height - height % 3) {\n                yield { x, y, w: 1, h: 1 };\n            }\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/tile.ts?");

/***/ })

/******/ });