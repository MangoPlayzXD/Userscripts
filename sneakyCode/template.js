const rawcode = 'https://cdn.jsdelivr.net/gh/MangoPlayzXD/Userscripts/sneakyCode/JSInjector.js'

function loadScript(url) {
    const script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
}

loadScript(rawcode);
