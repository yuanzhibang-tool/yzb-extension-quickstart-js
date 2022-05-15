const { extensionDebugger, DebuggerLogger } = require("@yuanzhibang/extension-debugger");
DebuggerLogger.withLog = true;
extensionDebugger.startServer(8080);
extensionDebugger.runExtension('./test-extension.js');