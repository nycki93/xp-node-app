import http from 'node:http';
import android from 'node-on-android';

const server = http.createServer();
server.on('request', async (req, res) => {

    const page = await fetch('https://example.com/');
    const text = await page.text();

    res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <meta charset="utf-8">
        <title>Hello World</title>
        <p>example.com is ${text.length} characters long!</p>
    `);
});

server.on('listening', () => {
    const { port } = server.address();
    console.log(`listening on port ${port}`);
    android.loadUrl(`http://localhost:${port}`);
});

server.listen(0);
