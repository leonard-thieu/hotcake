'use strict';

const path = require('path');

const config = {
    target: 'node',
    entry: {
        client: './vscode/client/src/extension.ts',
        server: './vscode/server/src/server.ts',
        binderTests: './tests/BinderTests.ts',
        monkeyTests: './tests/MonkeyTests.ts',
        parserTests: './tests/ParserTests.ts',
        preprocessorParserTests: './tests/PreprocessorParserTests.ts',
        preprocessorTokenizerGrammarTests: './tests/PreprocessorTokenizerGrammarTests.ts',
        preprocessorTokenizerInvariantsTests: './tests/PreprocessorTokenizerInvariantsTests.ts',
        tokenizerTests: './tests/TokenizerTests.ts',
    },
    output: {
        path: __dirname,
        filename: (chunkData) => {
            const entryPath = config.entry[chunkData.chunk.name];
            
            return path.join(path.dirname(entryPath), path.basename(entryPath, '.ts') + '.js');
        },
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    devtool: 'source-map',
    node: false,
    externals: {
        vscode: 'commonjs vscode',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
};

module.exports = config;