const rawcode = 'https://raw.githubusercontent.com/MangoPlayzXD/Userscripts/refs/heads/main/sneakyCode/JSInjector.js'

function loadScript(url) {
    const script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
}

loadScript(rawcode);
