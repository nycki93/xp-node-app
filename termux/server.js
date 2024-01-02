import http from 'node:http';
import { spawn } from 'node:child_process';

const port = 8000;

/**
 * @param {string} text 
 */
function untab(text) {
    // discard empty first line
    if (text[0] === '\n') {
        text = text.slice(1);
    }
    // detect leading indent
    const spaces = text.match(/^\s*/)[0].length;
    // remove from all lines
    const lines = text.split('\n').map((line) => {
        return line.slice(spaces);
    });
    return lines.join('\n');
}

const server = http.createServer()
let isLit = false;

server.on('request', async (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    await new Promise(cb => req.on('close', cb));
    
    if (body === 'input=light+mode') {
        spawn('termux-torch', [
            isLit ? 'off' : 'on',
        ]);
        isLit = !isLit;
    }

    res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8',
    });
    res.write(untab(`
        <!doctype html>
        <html lang="en">
        <meta 
            name="viewport" 
            content="width=device-width"
        >
        <title>My Website</title>
        <style>
            :root {
                margin: auto;
                max-width: 120ch;
                padding: 2ch;
                color-scheme: dark;
            }
        </style>
        <div id="main">
            <h1>Hello, World!</h1>
            <p>Request: ${req.method} ${req.url}</p>
            <p>Body: ${body || 'none'}</p>
            <form method="POST">
                <label for="input">Input:</label>
                <input name="input" type="text">
                <input type="submit" value="Submit">
            </form>
        </div>
    `));
    res.end();
});

server.listen(port);
