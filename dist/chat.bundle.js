/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/chatbox/Chatbox.ts":
/*!********************************!*\
  !*** ./src/chatbox/Chatbox.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Chatbox\": () => (/* binding */ Chatbox)\n/* harmony export */ });\n/* harmony import */ var _templates_invite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../templates/invite */ \"./src/templates/invite.ts\");\n/* harmony import */ var _Message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Message */ \"./src/chatbox/Message.ts\");\n\r\n\r\nclass Chatbox extends HTMLElement {\r\n    constructor() {\r\n        var _a, _b, _c;\r\n        super();\r\n        this.handleMessage = (message, sender) => {\r\n            this.messageBox.appendChild(new _Message__WEBPACK_IMPORTED_MODULE_1__.Message(message, sender, false).renderMessage());\r\n        };\r\n        this.sendMessage = () => {\r\n            this.messageBox.appendChild(new _Message__WEBPACK_IMPORTED_MODULE_1__.Message(this.textInput.value, 'Billiam', true).renderMessage());\r\n        };\r\n        const shadowRoot = this.attachShadow({ mode: 'open' });\r\n        shadowRoot.appendChild((0,_templates_invite__WEBPACK_IMPORTED_MODULE_0__.getTemplate)('chatBox'));\r\n        this.messageBox = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('messages');\r\n        this.textInput = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById('new-message');\r\n        this.sendButton = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.getElementById('send-message');\r\n        this.sendButton.addEventListener('click', () => {\r\n            this.sendMessage();\r\n        });\r\n    }\r\n}\r\ncustomElements.define('x-chatbox', Chatbox);\r\n\n\n//# sourceURL=webpack:///./src/chatbox/Chatbox.ts?");

/***/ }),

/***/ "./src/chatbox/Message.ts":
/*!********************************!*\
  !*** ./src/chatbox/Message.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Message\": () => (/* binding */ Message)\n/* harmony export */ });\nclass Message extends HTMLElement {\r\n    constructor(message, sender, isLocal) {\r\n        super();\r\n        this.message = message;\r\n        this.sender = sender;\r\n        this.isLocal = isLocal;\r\n        this.renderMessage = () => {\r\n            const newMessage = document.createElement('div');\r\n            newMessage.classList.add(this.isLocal ? 'right' : 'left');\r\n            newMessage.classList.add('message-box');\r\n            newMessage.innerHTML = `\r\n        <p class=\"message-sender\">${this.sender}</p>\r\n        <p class=\"message-content\">${this.message}</p>\r\n    `;\r\n            this.appendChild(newMessage);\r\n            return this;\r\n        };\r\n    }\r\n}\r\ncustomElements.define('x-message', Message);\r\n\n\n//# sourceURL=webpack:///./src/chatbox/Message.ts?");

/***/ }),

/***/ "./src/templates/invite.ts":
/*!*********************************!*\
  !*** ./src/templates/invite.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getTemplate\": () => (/* binding */ getTemplate),\n/* harmony export */   \"getColourSelection\": () => (/* binding */ getColourSelection)\n/* harmony export */ });\nconst invitePlayer = `\r\n    <link rel=\"stylesheet\" href=\"../../menu.css\">\r\n    <div class=\"invite-menu\">\r\n        <h1 class=\"popup-message\">Invite a player!</h1>\r\n        <input type=\"text\" id=\"playerName\">\r\n        <button class=\"popup-button\" id=\"inviteButton\">Invite</button>\r\n    </div>\r\n`;\r\nconst invitation = `\r\n  <link rel=\"stylesheet\" href=\"../../menu.css\">\r\n  <div class=\"popup\">\r\n  <h2 id=\"message\"></h2>\r\n    <button class=\"popup-button\" id=\"accept\">Accept</button>\r\n    <button class=\"popup-button\" id=\"reject\">Reject</button>\r\n  </div>\r\n  `;\r\nconst inviteWait = `\r\n  <link rel=\"stylesheet\" href=\"../../menu.css\">\r\n  <div class=\"invite-menu\">\r\n    <h2 class=\"popup-message\">Waiting for response, will automatically cancel after 30 seconds</h2>\r\n    <button class=\"popup-button\" id=\"cancel\">Cancel</button>\r\n  </div>\r\n`;\r\nconst chooseColour = `\r\n  <div class=\"light-bg\">\r\n      <div class=\"colour-select\">\r\n        <div class=\"black-square\">\r\n          <div id=\"is-white\" class=\"white select\">\r\n          </div>\r\n        </div>\r\n        <div class=\"white-square\"></div>\r\n      </div>\r\n      <div class=\"colour-select\">\r\n        <div class=\"white-square\"></div>\r\n        <div class=\"black-square\">\r\n          <div id=\"is-black\" class=\"black select\">\r\n          </div>\r\n        </div>\r\n      </div>\r\n  </div>\r\n`;\r\nconst chatBox = `\r\n  <link rel=\"stylesheet\" href=\"../../menu.css\">\r\n  <div id=\"chat-box\">\r\n      <div id=\"messages\"></div>\r\n      <textarea id=\"new-message\"></textarea>\r\n      <button id=\"send-message\">-></button>\r\n  </div>\r\n`;\r\nconst templates = {\r\n    invitePlayer,\r\n    invitation,\r\n    inviteWait,\r\n    chooseColour,\r\n    chatBox,\r\n};\r\nconst getTemplate = (tmplName) => {\r\n    const tmpl = document.createElement('template');\r\n    tmpl.innerHTML = templates[tmplName];\r\n    return tmpl.content.cloneNode(true);\r\n};\r\nconst getColourSelection = (title, tmpl) => {\r\n    const template = document.createElement('template');\r\n    template.innerHTML = `\r\n  <link rel=\"stylesheet\" href=\"../../menu.css\">\r\n  <div class=\"invite-menu\">\r\n      <h2 class=\"popup-message\" id=\"colour-heading\">${title}</h2>\r\n      ${templates[tmpl]}\r\n  </div>\r\n  `;\r\n    return template.content.cloneNode(true);\r\n};\r\n\n\n//# sourceURL=webpack:///./src/templates/invite.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/chatbox/Chatbox.ts");
/******/ 	
/******/ })()
;