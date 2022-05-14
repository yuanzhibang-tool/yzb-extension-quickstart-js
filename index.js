const yzbNode = require('@yuanzhibang/node');

console.log("Hello from child process");

// 接收渲染端发送的消息
yzbNode.ipc.on('test-node-message-topic', (sender, message) => {
    console.log(message);
    sender.error(message);
    // sender.next(message);
    yzbNode.ipc.send('test-renderer-message-topic', { test: 'test-renderer-message', test1: 'test1' });
});

