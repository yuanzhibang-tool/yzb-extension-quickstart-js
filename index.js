// import { ipc } from "@yuanzhibang/node"
const server = require('server');
const { get, post } = server.router;
const { fork } = require('child_process');

const p = fork('./test-extension.js');

function echoMessageTypeTitle(message) {
    console.log(`\u001b[1;31m * ${message}`);
}
function echoMessageInfoTitle(message) {
    console.log(`\u001b[1;32m - ${message}`);
}
function echoMessageDataTitle(message) {
    console.log(`\u001b[1;33m $ ${message}`);
}

function echoMessageDeliver() {
    console.log(`\u001b[1;35m -------------------------- *${Date()}* --------------------------`);
}

function echoRendererOtherMessage(message) {
    echoMessageDeliver();
    echoMessageTypeTitle('Sender not callback message to renderer');
    echoMessageDataTitle("callback data below");
    console.log(message);
    echoMessageDeliver();
}

const nextCallbackMap = new Map();
const errorCallbackMap = new Map();

p.on('message', (message) => {
    if (message !== null && typeof message === 'object') {
        if (message.hasOwnProperty('__type')) {
            const messageType = message.__type;
            if (messageType === 'yzb_ipc_node_message') {
                // 此为ipc消息类型
                const messageIdentity = message.identity;
                const data = message.data;
                const type = message.type;
                switch (type) {
                    case 'next':
                        {
                            echoMessageDeliver();
                            echoMessageTypeTitle('Next/Then callback to renderer');
                            echoMessageInfoTitle("message info below");
                            const consoleData = {
                                "type": 'next/then',
                                "identity": messageIdentity,
                            };
                            console.table(consoleData);
                            echoMessageDataTitle("callback data below");
                            console.log(data);
                            echoMessageDeliver();
                            if (nextCallbackMap.has(messageIdentity)) {
                                const data = message.data;
                                nextCallbackMap.get(messageIdentity)(data);
                                nextCallbackMap.delete(messageIdentity);
                            }
                        }
                        break;
                    case 'error':
                        {
                            echoMessageDeliver();
                            echoMessageTypeTitle('Error callback to renderer');
                            echoMessageInfoTitle("message info below");
                            const consoleData = {
                                "type": 'error',
                                "identity": messageIdentity,
                            };
                            console.table(consoleData);
                            echoMessageDataTitle("callback data below");
                            console.log(data);
                            echoMessageDeliver();
                            if (errorCallbackMap.has(messageIdentity)) {
                                const data = message.data;
                                errorCallbackMap.get(messageIdentity)(data);
                                nextCallbackMap.delete(messageIdentity);
                            }
                        }
                        break;
                    default:
                        // 错误类型不做任何处理
                        break;
                }
            } else if (messageType === 'yzb_ipc_renderer_message') {
                echoMessageDeliver();
                echoMessageTypeTitle('Sender topic message to renderer');
                echoMessageInfoTitle("message info below");
                const consoleData = {
                    "type": 'topic message to renderer',
                    "topic": message.topic,
                };
                console.table(consoleData);
                echoMessageDataTitle("topic data below");
                console.log(message.data);
                echoMessageDeliver();
            } else {
                echoRendererOtherMessage(message);
            }
        } else {
            echoRendererOtherMessage(message);
        }
    }
});

function sendMessageToProcess(message) {
    return new Promise((resolve, reject) => {
        const identity = message.identity;
        nextCallbackMap.set(identity, resolve);
        errorCallbackMap.set(identity, reject);
        p.send(message);
    });
}

let messageIdentityIndex = 0;
server({ port: 8080, security: { csrf: false } }, [
    get('/', ctx => {
        return 'Hello world';
    }),
    post('/*', ctx => {
        const url = ctx.url;
        const body = ctx.body;
        const topic = url.slice(1);
        messageIdentityIndex++;
        const messageIdentityString = `identity-${messageIdentityIndex}`;
        const message = {
            __type: "yzb_ipc_node_message",
            identity: messageIdentityString,
            data: {
                topic: topic,
                data: body
            }
        }
        echoMessageDeliver();
        echoMessageTypeTitle("Recieve message from renderer");
        echoMessageInfoTitle("message info below");
        const consoleMesssage = {
            identity: messageIdentityString,
            topic,
        }
        console.table(consoleMesssage);
        echoMessageDataTitle("topic data below");
        console.log(body);
        echoMessageDeliver();
        sendMessageToProcess(message).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            console.log('finally');
        });
        return 'ok';
    })
]);
