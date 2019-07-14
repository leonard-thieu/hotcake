import path = require('path');
import { createConnection, Diagnostic, ProposedFeatures, Range, TextDocument, TextDocuments } from 'vscode-languageserver';
import { Nodes } from '../../../src/Syntax/Node/Node';
import { Parser } from '../../../src/Syntax/Parser';
import { PreprocessorParser } from '../../../src/Syntax/PreprocessorParser';
import { PreprocessorTokenizer } from '../../../src/Syntax/PreprocessorTokenizer';
import { Tokenizer } from '../../../src/Syntax/Tokenizer';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
const documents: TextDocuments = new TextDocuments();

connection.onInitialize(() => {
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            hoverProvider: true,
        }
    };
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((params) => {
    validateTextDocument(params.document);
});

const preprocessorTokenizer = new PreprocessorTokenizer();
const preprocessorParser = new PreprocessorParser();
const tokenizer = new Tokenizer();
const parser = new Parser();

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    const diagnostics: Diagnostic[] = [];

    const text = textDocument.getText();
    const preprocessorTokens = preprocessorTokenizer.getTokens(text);
    const preprocessorModuleDeclaration = preprocessorParser.parse(textDocument.uri, text, preprocessorTokens);
    const tokens = tokenizer.getTokens(preprocessorModuleDeclaration, {
        HOST: 'winnt',
        LANG: 'cpp',
        TARGET: 'glfw',
        CONFIG: 'release',
        CD: path.dirname(textDocument.uri),
        MODPATH: textDocument.uri,
    });
    const moduleDeclaration = parser.parse(preprocessorModuleDeclaration, tokens);

    if (moduleDeclaration.parseDiagnostics) {
        for (const parseDiagnostic of moduleDeclaration.parseDiagnostics) {
            diagnostics.push({
                message: parseDiagnostic.message,
                range: Range.create(
                    textDocument.positionAt(parseDiagnostic.start),
                    textDocument.positionAt(parseDiagnostic.start + parseDiagnostic.length)
                ),
            });
        }
    }

    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onHover((params) => {
    const { textDocument: textDocumentIdentifier, position } = params;
    const textDocument = documents.get(textDocumentIdentifier.uri)!;
    const offset = textDocument.offsetAt(position);

    const text = textDocument.getText();
    const preprocessorTokens = preprocessorTokenizer.getTokens(text);
    const preprocessorModuleDeclaration = preprocessorParser.parse(textDocument.uri, text, preprocessorTokens);
    const tokens = tokenizer.getTokens(preprocessorModuleDeclaration, {
        HOST: 'winnt',
        LANG: 'cpp',
        TARGET: 'glfw',
        CONFIG: 'release',
        CD: path.dirname(textDocument.uri),
        MODPATH: textDocument.uri,
    });
    const moduleDeclaration = parser.parse(preprocessorModuleDeclaration, tokens);

    let containingNode: Nodes = moduleDeclaration;
    while (true) {
        const node: Nodes | undefined = containingNode.getChildNodeAt(offset);
        if (!node) {
            break;
        }
        containingNode = node;
    }

    const containingToken = containingNode.getChildTokenAt(offset)!;

    const lineage: string[] = [containingNode.kind, containingToken.kind];
    let parent = containingNode.parent;
    while (parent) {
        lineage.unshift(parent.kind);
        parent = parent.parent;
    }

    let contents = '';
    for (let i = 0; i < lineage.length; i++) {
        const nodeKind = lineage[i];
        contents += '\n' + (new Array(i + 1).join('  ')) + '* ' + nodeKind;
    }

    return {
        contents: contents,
    };
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
