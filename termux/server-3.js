import http from 'node:http';
import { spawn } from 'node:child_process';
import render from 'preact-render-to-string';
import { h } from 'preact';
import htm from 'htm';

const port = 8000;
const html = htm.bind(h);

const server = http.createServer()
let isLit = false;

server.on('request', async (req, res) => {
    let reqBody = '';
    req.on('data', (chunk) => {
        reqBody += chunk;
    });
    await new Promise(cb => req.on('close', cb));
    
    if (reqBody === 'input=light+mode') {
        spawn('termux-torch', [
            isLit ? 'off' : 'on',
        ]);
        isLit = !isLit;
    }

    let resBody = `
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
        `;
    
    resBody = render(html`
      <html lang="en">
      <meta 
        name="viewport" 
        content="width=device-width"
      />
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
        <p>Body: ${reqBody || 'none'}</p>
        <form method="POST">
          <label for="input">Input: </label>
          <input name="input" type="text" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    `);
    
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8',
    });
    res.write(resBody);
    res.end();
});

server.listen(port);
