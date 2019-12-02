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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tile */ \"./src/tile.ts\");\n\r\nconst fileInput = document.querySelector('#input-image');\r\nconst widthInput = document.querySelector('#input-width');\r\nconst heightInput = document.querySelector('#input-height');\r\nconst scaleInput = document.querySelector('#input-scale');\r\nconst offsetXInput = document.querySelector('#input-offset-x');\r\nconst offsetYInput = document.querySelector('#input-offset-y');\r\nconst preview = document.querySelector('#preview');\r\nconst workItem = document.querySelector('#work-item');\r\nconst output = document.querySelector('#output');\r\nconst context = preview.getContext('2d');\r\nfor (const el of [widthInput, heightInput, scaleInput, offsetXInput, offsetYInput]) {\r\n    el.addEventListener('input', draw);\r\n}\r\nfunction clamp() {\r\n    for (const el of [widthInput, heightInput, scaleInput]) {\r\n        el.value = Math.min(+el.value, +el.max).toString();\r\n    }\r\n}\r\nfor (const el of [widthInput, heightInput, scaleInput]) {\r\n    el.addEventListener('input', clamp);\r\n}\r\n// Easels can make square or rectangular photos.\r\n// The square paintings make images that are\r\n// 3x3 = 96px\r\n// 2x2 = 64px\r\n// 1x1 = 32px\r\n// in size. The rectangular photos don't get to the edge of\r\n// the block (small/med/large) so cannot be used for tiling\r\n// and can be ignored. Further, the 2x2 paintings don't fit\r\n// exactly with blocks, so any painting made with 2x2 paintings\r\n// must be made entirely of 2x2 paintings... so I only use 3x3\r\n// and 1x1 paintings to form the whole painting.\r\nlet image = new Image();\r\nfileInput.addEventListener('input', () => {\r\n    const file = fileInput.files[0];\r\n    const reader = new FileReader();\r\n    reader.addEventListener('load', () => {\r\n        image.src = String(reader.result);\r\n    });\r\n    if (file) {\r\n        reader.readAsDataURL(file);\r\n    }\r\n});\r\nimage.addEventListener('load', () => {\r\n    widthInput.max = Math.floor(image.width / 32).toString(); // FIXME\r\n    heightInput.max = Math.floor(image.height / 32).toString();\r\n    clamp();\r\n    draw();\r\n});\r\nfunction getPaintingRect() {\r\n    const scale = +scaleInput.value / 100;\r\n    const blockPixels = Math.min(scale * image.width / +widthInput.value, scale * image.height / +heightInput.value);\r\n    const paintingWidth = blockPixels * +widthInput.value;\r\n    const paintingHeight = blockPixels * +heightInput.value;\r\n    const offsetX = Math.min(image.width - paintingWidth, +offsetXInput.value);\r\n    const offsetY = Math.min(image.height - paintingHeight, +offsetYInput.value);\r\n    return { blockPixels, paintingHeight, paintingWidth, offsetX, offsetY };\r\n}\r\nfunction draw() {\r\n    if (!image.width)\r\n        return;\r\n    preview.width = image.width;\r\n    preview.height = image.height;\r\n    const { blockPixels, offsetX, offsetY } = getPaintingRect();\r\n    context.drawImage(image, 0, 0);\r\n    let count = 0;\r\n    for (const { x, y, w, h } of Object(_tile__WEBPACK_IMPORTED_MODULE_0__[\"tile\"])(+widthInput.value, +heightInput.value)) {\r\n        context.font = \"50px sans-serif\";\r\n        context.fillText(String(++count), x * blockPixels + offsetX, y * blockPixels + offsetY + 50);\r\n        context.strokeRect(x * blockPixels + offsetX, y * blockPixels + offsetY, w * blockPixels, h * blockPixels);\r\n    }\r\n}\r\ndocument.querySelector('button').addEventListener('click', () => {\r\n    const { blockPixels, offsetX, offsetY } = getPaintingRect();\r\n    while (output.firstChild)\r\n        output.firstChild.remove();\r\n    const context = workItem.getContext('2d');\r\n    let count = 0;\r\n    for (const { x, y, w, h } of Object(_tile__WEBPACK_IMPORTED_MODULE_0__[\"tile\"])(+widthInput.value, +heightInput.value)) {\r\n        workItem.width = w * blockPixels;\r\n        workItem.height = h * blockPixels;\r\n        context.drawImage(image, x * blockPixels + offsetX, y * blockPixels + offsetY, w * blockPixels, h * blockPixels, 0, 0, w * blockPixels, h * blockPixels);\r\n        const label = document.createElement('strong');\r\n        label.textContent = `Painting ${++count}`;\r\n        output.appendChild(label);\r\n        const item = new Image();\r\n        item.src = workItem.toDataURL();\r\n        item.classList.add('output-image');\r\n        output.appendChild(item);\r\n    }\r\n});\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/tile.ts":
/*!*********************!*\
  !*** ./src/tile.ts ***!
  \*********************/
/*! exports provided: transpose, tile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transpose\", function() { return transpose; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"tile\", function() { return tile; });\nfunction* transpose(data) {\r\n    for (const { x: y, y: x, w: h, h: w } of data) {\r\n        yield { x, y, w, h };\r\n    }\r\n}\r\nfunction* tile(width, height) {\r\n    for (let y = 0; y < height - 2; y += 3) {\r\n        for (let x = 0; x < width - 2; x += 3) {\r\n            yield { x, y, w: 3, h: 3 };\r\n        }\r\n    }\r\n    for (let y = 0; y < height; y++) {\r\n        for (let x = 0; x < width; x++) {\r\n            if (x >= width - width % 3 || y >= height - height % 3) {\r\n                yield { x, y, w: 1, h: 1 };\r\n            }\r\n        }\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/tile.ts?");

/***/ })

/******/ });