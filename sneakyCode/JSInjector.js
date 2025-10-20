 const TOGGLE_KEYBIND = {
        ctrlKey: true,
        shiftKey: true,
        key: 'j'
    };


    let consoleContainer = null;
    let outputArea = null;
    let inputArea = null;
    function logToOutput(message, type = 'info') {
        if (!outputArea) return;
        const span = document.createElement('span');
        const timestamp = new Date().toLocaleTimeString();
        span.innerText = `[${timestamp}] ${message}\n`;
        if (type === 'error') {
            span.style.color = '#ff4444';
        } else if (type === 'success') {
            span.style.color = '#808080';
        } else {
            span.style.color = '#eeeeee';
        }
        outputArea.appendChild(span);
        outputArea.scrollTop = outputArea.scrollHeight;
    }
    function createConsole() {
        if (consoleContainer) return;
        consoleContainer = document.createElement('div');
        consoleContainer.id = 'tm-js-console';
        consoleContainer.style.cssText = `
            position: fixed;
            bottom: 0px;
            right: 0px;
            width: 450px;
            height: 250px;
            background-color: #000;
            border: 1px solid #0f0;
            box-shadow: none;
            z-index: 99999;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            color: #0f0;
            display: flex;
            flex-direction: column;
            resize: both;
            overflow: hidden;
            cursor: grab;
        `;
        const consoleHeader = document.createElement('div');
        consoleHeader.style.cssText = `
            padding: 2px 4px;
            background-color: #050;
            border-bottom: 1px solid #0f0;
            font-weight: normal;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        `;
        consoleHeader.innerText = 'Code injector';
        const closeButton = document.createElement('button');
        closeButton.innerText = 'X';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: #0f0;
            font-size: 1em;
            cursor: pointer;
            padding: 0 2px;
            line-height: 1;
        `;
        closeButton.onclick = () => {
            consoleContainer.style.display = 'none';
        };
        consoleHeader.appendChild(closeButton);
        outputArea = document.createElement('pre');
        outputArea.id = 'tm-console-output';
        outputArea.style.cssText = `
            flex-grow: 1;
            background-color: #000;
            margin: 0;
            padding: 4px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-all;
            border-bottom: 1px solid #0f0;
            font-size: inherit;
            line-height: 1.2;
            color: inherit;
        `;
        inputArea = document.createElement('textarea');
        inputArea.id = 'tm-console-input';
        inputArea.placeholder = 'execute code here...';
        inputArea.style.cssText = `
            width: calc(100% - 8px);
            min-height: 40px;
            padding: 4px;
            border: none;
            background-color: #000;
            color: #0f0;
            outline: none;
            resize: vertical;
            font-family: inherit;
            font-size: inherit;
            box-sizing: border-box;
            caret-color: #0f0;
        `;
        inputArea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                const code = inputArea.value;
                if (!code.trim()) {
                    logToOutput('Error: Input is empty.', 'error');
                    return;
                }
                logToOutput(`> ${code.substring(0, 50)}${code.length > 50 ? '...' : ''}`, 'info');
                try {
                    const result = new Function(code)();
                    logToOutput(`=> ${String(result)}`, 'success');
                } catch (error) {
                    logToOutput(`ERROR: ${error.message}`, 'error');
                    console.error('JS Console Error:', error);
                }
                inputArea.value = '';
            }
        });
        consoleContainer.appendChild(consoleHeader);
        consoleContainer.appendChild(outputArea);
        consoleContainer.appendChild(inputArea);
        document.body.appendChild(consoleContainer);
        let isDragging = false;
        let offsetX, offsetY;
        consoleHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            consoleContainer.style.cursor = 'grabbing';
            offsetX = e.clientX - consoleContainer.getBoundingClientRect().left;
            offsetY = e.clientY - consoleContainer.getBoundingClientRect().top;
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            const maxLeft = window.innerWidth - consoleContainer.offsetWidth;
            const maxTop = window.innerHeight - consoleContainer.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            consoleContainer.style.left = newLeft + 'px';
            consoleContainer.style.top = newTop + 'px';
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            consoleContainer.style.cursor = 'grab';
        });
        consoleContainer.style.display = 'none';
    }
    document.addEventListener('keydown', (e) => {
        const keyMatch = e.key.toLowerCase() === TOGGLE_KEYBIND.key.toLowerCase();
        const ctrlMatch = !TOGGLE_KEYBIND.ctrlKey || e.ctrlKey;
        const shiftMatch = !TOGGLE_KEYBIND.shiftKey || e.shiftKey;
        const altMatch = !TOGGLE_KEYBIND.altKey || e.altKey;
        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
            e.preventDefault();
            if (!consoleContainer) {
                createConsole();
            }
            if (consoleContainer) {
                if (consoleContainer.style.display === 'none') {
                    consoleContainer.style.display = 'flex';
                    if (inputArea) inputArea.focus();
                } else {
                    consoleContainer.style.display = 'none';
                }
            }
        }
    });
