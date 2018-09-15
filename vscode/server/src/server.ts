import path = require('path');
import { createConnection, Diagnostic, InitializeParams, ProposedFeatures, Range, TextDocument, TextDocuments } from 'vscode-languageserver';
import { Parser } from '../../../src/Parser';
import { PreprocessorParser } from '../../../src/PreprocessorParser';
import { PreprocessorTokenizer } from '../../../src/PreprocessorTokenizer';
import { Tokenizer } from '../../../src/Tokenizer';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();

connection.onInitialize((params: InitializeParams) => {
	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
		}
	};
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

const preprocessorTokenizer = new PreprocessorTokenizer();
const preprocessorParser = new PreprocessorParser();
const tokenizer = new Tokenizer();
const parser = new Parser();

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	let text = textDocument.getText();

	let diagnostics: Diagnostic[] = [];

	const preprocessorTokens = preprocessorTokenizer.getTokens(text);
	const preprocessorModuleDeclaration = preprocessorParser.parse(textDocument.uri, text, preprocessorTokens);
	const tokens = tokenizer.getTokens(text, preprocessorModuleDeclaration, {
		HOST: 'winnt',
		LANG: 'cpp',
		TARGET: 'glfw',
		CONFIG: 'release',
		CD: path.dirname(textDocument.uri),
		MODPATH: textDocument.uri,
	});
	const moduleDeclaration = parser.parse(textDocument.uri, text, tokens);

	if (moduleDeclaration.parseDiagnostics) {
		connection.console.log(JSON.stringify(moduleDeclaration.parseDiagnostics, null, 2));
		for (const parseDiagnostic of moduleDeclaration.parseDiagnostics) {
			diagnostics.push({
				message: parseDiagnostic.message,
				range: Range.create(textDocument.positionAt(parseDiagnostic.start), textDocument.positionAt(parseDiagnostic.start + parseDiagnostic.length)),
			});
		}
	}

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
