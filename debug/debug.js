const { extensionDebugger, DebuggerLogger } = require("@yuanzhibang/extension-debugger");
// 开启日志，设置false为关闭
DebuggerLogger.withLog = true;
// 启动调试网络服务，端口号为8080
extensionDebugger.startServer(8080);
// 启动开发的拓展
extensionDebugger.runExtension('./src/index.js');

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

// !与前端联合调试请将上方代码注释,启动ws调试服务

// extensionDebugger.startWsServer(8889);
// extensionDebugger.setExtensionPath("./src/index.js");
