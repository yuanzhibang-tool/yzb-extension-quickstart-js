const { extensionDebugger, DebuggerLogger } = require("@yuanzhibang/extension-debugger");
DebuggerLogger.withLog = true;
extensionDebugger.startServer(8080);
extensionDebugger.runExtension('./test-extension.js');

// 手动发送topic消息
extensionDebugger.sendPromise('test-node-process-messsage-topic', { k1: 'v1' })
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        console.log('finally');
    });

// 设置渲染端的topic消息回调
extensionDebugger.setRendererTopicMessageCallback((topic, message) => {
    console.log(topic);
    console.log(message);
});

// 设置渲染段非topic消息回调
extensionDebugger.setRendererOtherMessageCallback((message) => {
    console.log(message);
});

