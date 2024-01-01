import { Webview } from 'webview-nodejs';

let body = `<h1>My App</h1>`;

function addButton() {
    w.eval('alert("hello world")');
    body += '<button onclick="addButton()">Add Button</button>';
    w.html(body);
    w.show();
}

const w = new Webview();
w.title('Hello, World!');
w.size(800, 600);
w.bind('addButton', addButton);

addButton();

w.show();
