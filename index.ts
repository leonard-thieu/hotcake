import antlr4 = require('antlr4');
import {
    CommonTokenStream,
    InputStream,
} from 'antlr4';
import {
    createServer,
    IncomingMessage,
    ServerResponse,
} from 'http';

const { ChatLexer } = require('./ChatLexer');
const { ChatParser } = require('./ChatParser');
const { HtmlChatListener } = require('./HtmlChatListener');

createServer((req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, {
        'Content-Type': 'text/html',
    });

    res.write('<html><head><meta charset="UTF-8"/></head><body>');

    const input = 'john SHOUTS: hello @michael /pink/this will work/ :-) \n';
    const chars = new InputStream(input);
    const lexer = new ChatLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new ChatParser(tokens);
    parser.buildParseTrees = true;
    const tree = parser.chat();
    const htmlChat = new HtmlChatListener(res);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(htmlChat, tree);

    res.write('</body></html>');
    res.end();
}).listen(1337);
