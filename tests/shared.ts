import glob = require('glob');
import fs = require('fs');
import path = require('path');
import process = require('process');
import mkdirp = require('mkdirp');
import { orderBy } from 'natural-orderby';
import { BoundNodeKind } from '../src/Binding/Node/BoundNodeKind';
import { BoundModuleDeclaration } from '../src/Binding/Node/Declaration/BoundModuleDeclaration';
import { Type } from '../src/Binding/Type/Type';
import { Project } from '../src/Project';
import { ModuleDeclaration } from '../src/Syntax/Node/Declaration/ModuleDeclaration';
import { PreprocessorModuleDeclaration } from '../src/Syntax/Node/Declaration/PreprocessorModuleDeclaration';
import { Parser } from '../src/Syntax/Parser';
import { PreprocessorParser } from '../src/Syntax/PreprocessorParser';
import { PreprocessorTokenizer } from '../src/Syntax/PreprocessorTokenizer';
import { Tokens } from '../src/Syntax/Token/Token';
import { ConfigurationVariables, Tokenizer } from '../src/Syntax/Tokenizer';

interface TestCaseOptions {
    name: string;
    casesPath: string;
    testCallback: TestCallback;
    beforeCallback?: Mocha.Func;
    afterCallback?: Mocha.Func;
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
        beforeCallback,
        afterCallback,
    } = options;

    let skippedCases: string[];
    try {
        skippedCases = require(`./${name}.skipped.json`);
    } catch (error) {
        skippedCases = [];
    }

    describe(name, function () {
        if (beforeCallback) {
            before(beforeCallback);
        }

        if (afterCallback) {
            after(afterCallback);
        }

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

export function executeBaselineTestCase(outputPath: string, testCallback: () => any, replacer?: (key: string, value: any) => any): void {
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

    const json = JSON.stringify(result, replacer, 4);
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
                    return getPreprocessorParseTree(sourceRelativePath, contents);
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
                    return getTokens(sourceRelativePath, contents);
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

export function executeBinderTestCases(name: string, casesPath: string): void {
    executeTestCases({
        name: name,
        casesPath: casesPath,
        testCallback: function (context) {
            const { _it, sourceRelativePath, contents } = context;

            _it(sourceRelativePath, function () {
                const outputPath = path.resolve(__dirname, 'cases', name, sourceRelativePath) + '.boundTree.json';
                executeBaselineTestCase(outputPath, () => {
                    return getBoundTree(path.resolve(casesPath, sourceRelativePath), contents);
                }, function (this: any, key, value) {
                    switch (key) {
                        case 'project':
                        case 'directory':
                        case 'parent': {
                            return undefined;
                        }
                        case 'declaration': {
                            if (this.kind !== BoundNodeKind.DataDeclarationStatement) {
                                if (value.kind === BoundNodeKind.ModuleDeclaration) {
                                    return value.identifier.name;
                                }

                                return undefined;
                            }
                            break;
                        }
                        case 'identifier': {
                            return value.name;
                        }
                        case 'locals': {
                            const names: any[] = [];
                            for (const [k] of value) {
                                names.push(k);
                            }
                            return names;
                        }
                    }

                    if (value instanceof Type) {
                        return value.toString();
                    }

                    return value;
                });
            });
        },
    });
}

export function getPreprocessorTokens(document: string): Tokens[] {
    const lexer = new PreprocessorTokenizer();

    return lexer.getTokens(document);
}

export function getPreprocessorParseTree(filePath: string, document: string): PreprocessorModuleDeclaration {
    const parser = new PreprocessorParser();
    const tokens = getPreprocessorTokens(document);

    return parser.parse(filePath, document, tokens);
}

export function getTokens(filePath: string, document: string): Tokens[] {
    const preprocessorModuleDeclaration = getPreprocessorParseTree(filePath, document);
    const tokenizer = new Tokenizer();
    const configVars: ConfigurationVariables = {
        HOST: 'winnt',
        LANG: 'cpp',
        TARGET: 'glfw',
        CONFIG: 'release',
        CD: __dirname,
        MODPATH: __filename,
    };

    return tokenizer.getTokens(preprocessorModuleDeclaration, configVars);
}

export function getParseTree(filePath: string, document: string): ModuleDeclaration {
    const preprocessorModuleDeclaration = getPreprocessorParseTree(filePath, document);
    const tokenizer = new Tokenizer();
    const configVars: ConfigurationVariables = {
        HOST: 'winnt',
        LANG: 'cpp',
        TARGET: 'glfw',
        CONFIG: 'release',
        CD: __dirname,
        MODPATH: __filename,
    };
    const tokens = tokenizer.getTokens(preprocessorModuleDeclaration, configVars);
    const parser = new Parser();

    return parser.parse(preprocessorModuleDeclaration, tokens);
}

export function getBoundTree(filePath: string, document: string): BoundModuleDeclaration {
    let frameworkDirectory = process.env.HOTCAKE_FRAMEWORK_DIR;
    if (!frameworkDirectory) {
        throw new Error(`The environment variable 'HOTCAKE_FRAMEWORK_DIR' must be set to the framework root directory.`);
    }
    frameworkDirectory = path.resolve(frameworkDirectory);

    const projectDirectory = path.dirname(filePath);
    const project = new Project(frameworkDirectory, projectDirectory);

    return project.importModule(filePath);
}
