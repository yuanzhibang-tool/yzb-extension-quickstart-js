console.log("Hello from child process");
const { ipc } = require("@yuanzhibang/node");
// 接收渲染端发送的消息
ipc.on('test-node-message-topic', (sender, message) => {
    sender.error(message);
    // sender.next(message);
    ipc.send('test-renderer-message-topic', { test: 'test-renderer-message', test1: 'test1' });
    process.send({ k1: 'v1' });
});

ipc.on('test-node-process-messsage-topic', (sender, message) => {
    // sender.next(message);
    sender.error(message);
});

function sum(a, b) {
    return a + b;
}

module.exports = sum;

// !生命周期函数,具体请参照:https://doc.yuanzhibang.com/#/extension-develop/notice

// 将要初始化前执行
const willInitData = {
    type: 'willInitData'
};
ipc.sendOnWillInit(willInitData);

const onInitData = {
    type: 'onInitData'
};

// 初始化完成执行
ipc.sendOnInit(onInitData);

// 获取状态属性回调,用以前端恢复状态,由前端调用 @yuanzhibang/renderer 发送
ipc.onGetProperty((sender, message) => {
    console.log(message);
    sender.next({});
});

// 用户调取退出,由前端调用 @yuanzhibang/renderer 发送

ipc.onUserExit((sender, message) => {
    console.log(message);
    sender.next({});
    process.exit(0);
});

// 将要退出前执行
const willExitData = {
    type: 'willExitData'
};

ipc.sendOnWillExit(willExitData);