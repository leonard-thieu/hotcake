import glob = require('glob');
import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import { orderBy } from 'natural-orderby';

import { PreprocessorParser } from '../src/PreprocessorParser';
import { Token } from '../src/Token';
import { Tokenizer } from '../src/Tokenizer';
import { TokenKind } from '../src/TokenKind';

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
            if (skippedCases && skippedCases.includes(sourceRelativePath)) {
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

export function executeTokenizerTestCases(name: string, casesPath: string) {
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

export function executePreprocessorParserTestCases(name: string, casesPath: string) {
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

export function getTokens(contents: string) {
    const tokenizer = new Tokenizer(contents);
    const tokens: Token[] = [];

    let t: Token;
    do {
        t = tokenizer.next();
        tokens.push(t);
    } while (t.kind !== TokenKind.EOF);

    return tokens;
}

export function getPreprocessorParseTree(contents: string) {
    const parser = new PreprocessorParser();

    return parser.parse(contents);
}
