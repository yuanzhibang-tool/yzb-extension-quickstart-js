// import { ipc } from "@yuanzhibang/node"
console.log("Hello from child process");
const { ipc } = require("@yuanzhibang/node");
// 接收渲染端发送的消息
ipc.on('test-node-message-topic', (sender, message) => {
    console.log(message);
    sender.error(message);
    // sender.next(message);
    ipc.send('test-renderer-message-topic', { test: 'test-renderer-message', test1: 'test1' });
});

