const server = require('server');
const { post } = server.router;

class Debugger {
    start(port) {
        server({ port }, [
            post('/', ctx => {
                console.log(ctx.data);
                return 'ok';
            })
        ]);
    }
}

const d = new Debugger();
d.start(8081);
