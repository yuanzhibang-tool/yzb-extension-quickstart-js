const { extensionDebugger } = require("@yuanzhibang/extension-debugger");
extensionDebugger.startServer(8080);
extensionDebugger.runExtension('./test-extension.js');