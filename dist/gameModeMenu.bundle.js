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

/***/ "./src/game/utils.ts":
/*!***************************!*\
  !*** ./src/game/utils.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"isInSquare\": () => (/* binding */ isInSquare),\n/* harmony export */   \"getSquare\": () => (/* binding */ getSquare),\n/* harmony export */   \"detectPiece\": () => (/* binding */ detectPiece),\n/* harmony export */   \"isOutOfBounds\": () => (/* binding */ isOutOfBounds),\n/* harmony export */   \"isOpenSpace\": () => (/* binding */ isOpenSpace),\n/* harmony export */   \"getCookie\": () => (/* binding */ getCookie),\n/* harmony export */   \"reverseCoord\": () => (/* binding */ reverseCoord),\n/* harmony export */   \"getPieceListAll\": () => (/* binding */ getPieceListAll),\n/* harmony export */   \"getPieceList\": () => (/* binding */ getPieceList)\n/* harmony export */ });\nconst isInSquare = (x, y, square) => {\r\n    const { top, bottom, left, right } = square.getBoundingClientRect();\r\n    return x >= left && x <= right && y >= top && y <= bottom;\r\n};\r\nconst getSquare = (x, y) => {\r\n    return document.getElementById(`${x}-${y}`);\r\n};\r\nconst detectPiece = (x, y, pieces) => {\r\n    const piece = pieces.find((piece) => {\r\n        return piece.pos.x === x && piece.pos.y === y;\r\n    });\r\n    if (piece) {\r\n        return piece;\r\n    }\r\n    return null;\r\n};\r\nconst isOutOfBounds = (x, y) => {\r\n    const outsideSpaces = [-1, -2, 8, 9];\r\n    return outsideSpaces.includes(x) || outsideSpaces.includes(y);\r\n};\r\nconst isOpenSpace = (x, y, pieces) => {\r\n    if (isOutOfBounds(x, y)) {\r\n        return false;\r\n    }\r\n    return !pieces.some((piece) => piece.pos.x === x && piece.pos.y === y);\r\n};\r\nconst getCookie = (name) => {\r\n    var value = '; ' + document.cookie;\r\n    var parts = value.split('; ' + name + '=');\r\n    const part = parts.pop();\r\n    if (part)\r\n        return part.split(';').shift();\r\n};\r\nconst reverseCoord = (coord) => {\r\n    return Math.abs(Number(coord) - 7);\r\n};\r\nconst getPieceListAll = (allPieces) => {\r\n    return [\r\n        ...Object.values(allPieces.blacks),\r\n        ...Object.values(allPieces.whites),\r\n    ];\r\n};\r\nconst getPieceList = (pieces) => {\r\n    return Object.entries(pieces);\r\n};\r\n\n\n//# sourceURL=webpack:///./src/game/utils.ts?");

/***/ }),

/***/ "./src/menu/gameMenu.ts":
/*!******************************!*\
  !*** ./src/menu/gameMenu.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game/utils */ \"./src/game/utils.ts\");\n/* harmony import */ var _templates_invite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../templates/invite */ \"./src/templates/invite.ts\");\n\r\n\r\nconst menu = document.querySelector('.menu-container');\r\nclass InviteWindow extends HTMLDivElement {\r\n    constructor(player, userId) {\r\n        super();\r\n        this.player = player;\r\n        this.userId = userId;\r\n        this.acceptInvite = () => {\r\n            window.location.href = `../../src/game/draughts.php?opponent=${this.userId}`;\r\n        };\r\n        this.rejectInvite = () => {\r\n            socket.send(JSON.stringify({ type: 'end' }));\r\n            this.remove();\r\n        };\r\n        this.classList.add('popup');\r\n        let shadowRoot = this.attachShadow({ mode: 'open' });\r\n        shadowRoot.appendChild((0,_templates_invite__WEBPACK_IMPORTED_MODULE_1__.getTemplate)('invitation'));\r\n        const message = shadowRoot.getElementById('message');\r\n        if (message) {\r\n            message.innerText = `${this.player} wants to play!`;\r\n        }\r\n        const accept = shadowRoot.getElementById('accept');\r\n        if (accept) {\r\n            accept.addEventListener('click', this.acceptInvite);\r\n        }\r\n        const reject = shadowRoot.getElementById('reject');\r\n        if (reject) {\r\n            reject.addEventListener('click', this.rejectInvite);\r\n        }\r\n    }\r\n    connectedCallback() {\r\n        setTimeout(() => this.rejectInvite(), 30000);\r\n    }\r\n}\r\ncustomElements.define('x-invite-window', InviteWindow, { extends: 'div' });\r\nconst socket = new WebSocket('ws://localhost:8001/');\r\nsocket.addEventListener('open', () => {\r\n    socket.addEventListener('message', (event) => {\r\n        const data = JSON.parse(event.data);\r\n        if (data.type === 'invite') {\r\n            menu.appendChild(new InviteWindow(data.userName, data.id));\r\n        }\r\n    });\r\n    const userId = (0,_game_utils__WEBPACK_IMPORTED_MODULE_0__.getCookie)('id');\r\n    if (userId) {\r\n        socket.send(JSON.stringify({ type: 'start', id: Number(userId) }));\r\n    }\r\n});\r\n\n\n//# sourceURL=webpack:///./src/menu/gameMenu.ts?");

/***/ }),

/***/ "./src/templates/invite.ts":
/*!*********************************!*\
  !*** ./src/templates/invite.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getTemplate\": () => (/* binding */ getTemplate),\n/* harmony export */   \"getColourSelection\": () => (/* binding */ getColourSelection)\n/* harmony export */ });\nconst invitePlayer = `\r\n    <link rel=\"stylesheet\" href=\"../../menu.css\">\r\n    <div class=\"invite-menu\">\r\n        <h1 class=\"popup-message\">Invite a player!</h1>\r\n        <input type=\"text\" id=\"playerName\">\r\n        <button class=\"popup-button\" id=\"inviteButton\">Invite</button>\r\n    </div>\r\n`;\r\nconst invitation = `\r\n  <link rel=\"stylesheet\" href=\"../../menu.css\">\r\n  <div class=\"popup\">\r\n  <h2 id=\"message\"></h2>\r\n    <button class=\"popup-button\" id=\"accept\">Accept</button>\r\n    <button class=\"popup-button\" id=\"reject\">Reject</button>\r\n  </div>\r\n  `;\r\nconst inviteWait = `\r\n  <link rel=\"stylesheet\" href=\"../../menu.css\">\r\n  <div class=\"invite-menu\">\r\n    <h2 class=\"popup-message\">Waiting for response, will automatically cancel after 30 seconds</h2>\r\n    <button class=\"popup-button\" id=\"cancel\">Cancel</button>\r\n  </div>\r\n`;\r\nconst chooseColour = `\r\n  <div class=\"light-bg\">\r\n      <div class=\"colour-select\">\r\n        <div class=\"black-square\">\r\n          <div id=\"is-white\" class=\"white select\">\r\n          </div>\r\n        </div>\r\n        <div class=\"white-square\"></div>\r\n      </div>\r\n      <div class=\"colour-select\">\r\n        <div class=\"white-square\"></div>\r\n        <div class=\"black-square\">\r\n          <div id=\"is-black\" class=\"black select\">\r\n          </div>\r\n        </div>\r\n      </div>\r\n  </div>\r\n`;\r\nconst chatBox = `\r\n  <link rel=\"stylesheet\" href=\"../../menu.css\">\r\n  <div id=\"chat-box\">\r\n      <div id=\"messages\"></div>\r\n      <div id=\"type-area\">\r\n      <div id=\"type-input\">\r\n        <textarea id=\"new-message\"></textarea>\r\n        <button id=\"send-message\" class=\"popup-button\">^</button>\r\n      </div>\r\n      </div>\r\n  </div>\r\n`;\r\nconst playerCard = `\r\n  <link rel=\"stylesheet\" href=\"../../menu.css\">\r\n  <div id=\"card\" class=\"player-info\">\r\n    <div class=\"player-card-right\">\r\n      <h1 id=\"username\"></h1>\r\n      <div class=\"black-square light-bg\">\r\n      <div id=\"colour\" class=\"select\"></div></div>\r\n    </div>\r\n    <div id=\"captures\"></div>\r\n  </div>\r\n`;\r\nconst templates = {\r\n    invitePlayer,\r\n    invitation,\r\n    inviteWait,\r\n    chooseColour,\r\n    chatBox,\r\n    playerCard,\r\n};\r\nconst getTemplate = (tmplName) => {\r\n    const tmpl = document.createElement('template');\r\n    tmpl.innerHTML = templates[tmplName];\r\n    return tmpl.content.cloneNode(true);\r\n};\r\nconst getColourSelection = (title, tmpl) => {\r\n    const template = document.createElement('template');\r\n    template.innerHTML = `\r\n  <link rel=\"stylesheet\" href=\"../../menu.css\">\r\n  <div class=\"invite-menu\">\r\n      <h2 class=\"popup-message\" id=\"colour-heading\">${title}</h2>\r\n      ${templates[tmpl]}\r\n  </div>\r\n  `;\r\n    return template.content.cloneNode(true);\r\n};\r\n\n\n//# sourceURL=webpack:///./src/templates/invite.ts?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/menu/gameMenu.ts");
/******/ 	
/******/ })()
;