import glob = require('glob');
import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import { orderBy } from 'natural-orderby';
import { Module } from '../src/Node/Module';
import { PreprocessorModule } from '../src/Node/PreprocessorModule';
import { Parser } from '../src/Parser';
import { PreprocessorParser } from '../src/PreprocessorParser';
import { PreprocessorTokenizer } from '../src/PreprocessorTokenizer';
import { Token } from '../src/Token';
import { ConfigurationVariables, Tokenizer } from '../src/Tokenizer';

interface TestCaseOptions {
    name: string;
    casesPath: string;
    testCallback: TestCallback;
}

interface TestContext {
    _it: Mocha.PendingTestFunction;
    sourceRelativePath: string;
    contents: string;
}

type TestCallback = (context: TestContext) => void;

export function executeTestCases(options: TestCaseOptions): void {
    const {
        name,
        casesPath,
        testCallback,
    } = options;

    let skippedCases: string[];
    try {
        skippedCases = require(`./${name}.skipped.json`);
    } catch (error) {
        skippedCases = [];
    }

    describe(name, function () {
        const casesGlobPath = path.join(casesPath, '**', '*.monkey');
        const sourcePaths = orderBy(glob.sync(casesGlobPath));

        for (const sourcePath of sourcePaths) {
            const sourceRelativePath = path.relative(casesPath, sourcePath);

            let _it: Mocha.PendingTestFunction = it;
            if (skippedCases.includes(sourceRelativePath)) {
                _it = xit;
            }

            const contents = fs.readFileSync(sourcePath, 'utf8');
            testCallback({
                _it,
                sourceRelativePath,
                contents,
            });
        }
    });
}

export function executeBaselineTestCase(outputPath: string, testCallback: () => any): void {
    mkdirp.sync(path.dirname(outputPath));

    try {
        fs.unlinkSync(outputPath);
    } catch (error) {
        switch (error.code) {
            case 'ENOENT': { break; }
            default: { throw error; }
        }
    }

    const result = testCallback();

    const json = JSON.stringify(result, null, 2);
    fs.writeFileSync(outputPath, json);
}

export function executePreprocessorTokenizerTestCases(name: string, casesPath: string): void {
    executeTestCases({
        name: name,
        casesPath: casesPath,
        testCallback: function (context) {
            const { _it, sourceRelativePath, contents } = context;

            _it(sourceRelativePath, function () {
                const outputPath = path.resolve(__dirname, 'cases', name, sourceRelativePath) + '.tokens.json';
                executeBaselineTestCase(outputPath, () => {
                    return getPreprocessorTokens(contents);
                });
            });
        },
    });
}

export function executePreprocessorParserTestCases(name: string, casesPath: string): void {
    executeTestCases({
        name: name,
        casesPath: casesPath,
        testCallback: function (context) {
            const { _it, sourceRelativePath, contents } = context;

            _it(sourceRelativePath, function () {
                const outputPath = path.resolve(__dirname, 'cases', name, sourceRelativePath) + '.tree.json';
                executeBaselineTestCase(outputPath, () => {
                    return getPreprocessorParseTree(contents);
                });
            });
        },
    });
}

export function executeTokenizerTestCases(name: string, casesPath: string): void {
    executeTestCases({
        name: name,
        casesPath: casesPath,
        testCallback: function (context) {
            const { _it, sourceRelativePath, contents } = context;

            _it(sourceRelativePath, function () {
                const outputPath = path.resolve(__dirname, 'cases', name, sourceRelativePath) + '.tokens.json';
                executeBaselineTestCase(outputPath, () => {
                    return getTokens(contents);
                });
            });
        },
    });
}

export function executeParserTestCases(name: string, casesPath: string): void {
    executeTestCases({
        name: name,
        casesPath: casesPath,
        testCallback: function (context) {
            const { _it, sourceRelativePath, contents } = context;

            _it(sourceRelativePath, function () {
                const outputPath = path.resolve(__dirname, 'cases', name, sourceRelativePath) + '.tree.json';
                executeBaselineTestCase(outputPath, () => {
                    return getParseTree(sourceRelativePath, contents);
                });
            });
        },
    });
}

export function getPreprocessorTokens(document: string): Token[] {
    const lexer = new PreprocessorTokenizer();

    return lexer.getTokens(document);
}

export function getPreprocessorParseTree(document: string): PreprocessorModule {
    const parser = new PreprocessorParser();

    return parser.parse(document);
}

export function getTokens(document: string): Token[] {
    const tree = getPreprocessorParseTree(document);
    const tokenizer = new Tokenizer();
    const configVars: ConfigurationVariables = {
        HOST: 'winnt',
        LANG: 'cpp',
        TARGET: 'glfw',
        CONFIG: 'release',
        CD: __dirname,
        MODPATH: __filename,
    };

    return Array.from(tokenizer.getTokens(document, tree, configVars));
}

export function getParseTree(filePath: string, document: string): Module {
    const tokens = getTokens(document);
    const parser = new Parser();

    return parser.parse(filePath, document, tokens);
}
