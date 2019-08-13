import glob = require('glob');
import fs = require('fs');
import os = require('os');
import path = require('path');
import process = require('process');
import mkdirp = require('mkdirp');
import { orderBy } from 'natural-orderby';
import { Scope } from '../src/Binding/Binder';
import { BoundNodeKind } from '../src/Binding/Node/BoundNodes';
import { BoundAliasDirective } from '../src/Binding/Node/Declaration/BoundAliasDirective';
import { BoundClassDeclaration } from '../src/Binding/Node/Declaration/BoundClassDeclaration';
import { BoundDeclarations } from '../src/Binding/Node/Declaration/BoundDeclarations';
import { BoundDirectory } from '../src/Binding/Node/Declaration/BoundDirectory';
import { BoundFunctionLikeGroupDeclaration } from '../src/Binding/Node/Declaration/BoundFunctionLikeGroupDeclaration';
import { BoundInterfaceDeclaration } from '../src/Binding/Node/Declaration/BoundInterfaceDeclaration';
import { BoundModuleDeclaration } from '../src/Binding/Node/Declaration/BoundModuleDeclaration';
import { Type } from '../src/Binding/Type/Types';
import { ConfigurationVariables } from "../src/Configuration";
import { Diagnostic, DiagnosticBag, DiagnosticKind } from '../src/Diagnostics';
import { Project } from '../src/Project';
import { ModuleDeclaration } from '../src/Syntax/Node/Declaration/ModuleDeclaration';
import { PreprocessorModuleDeclaration } from '../src/Syntax/Node/Declaration/PreprocessorModuleDeclaration';
import { Parser } from '../src/Syntax/Parser';
import { PreprocessorParser } from '../src/Syntax/PreprocessorParser';
import { PreprocessorTokenizer } from '../src/Syntax/PreprocessorTokenizer';
import { Tokens } from '../src/Syntax/Token/Tokens';
import { Tokenizer } from '../src/Syntax/Tokenizer';

const LOG_LEVEL = DiagnosticKind.Error;

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

export function executeTestCases(
    {
        name,
        casesPath,
        testCallback,
    }: TestCaseOptions,
): void {
    let skippedCases: string[];
    try {
        skippedCases = require(`./${name}.skipped.json`);
    } catch (error) {
        skippedCases = [];
    }

    for (let i = 0; i < skippedCases.length; i++) {
        const skippedCase = skippedCases[i];
        skippedCases[i] = path.normalize(skippedCase);
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

export function executeBaselineTestCase(
    outputPath: string,
    testCallback: (() => any),
    replacer?: ((key: string, value: any) => any),
): void {
    mkdirp.sync(path.dirname(outputPath));

    try {
        fs.unlinkSync(outputPath);
    } catch (error) {
        switch (error.code) {
            case 'ENOENT': { break; }
            default: { throw error; }
        }
    }

    try {
        const result = testCallback();

        const json = JSON.stringify(result, replacer, /*space*/ 4);
        fs.writeFileSync(outputPath, json);

        if (result.project) {
            writeDiagnostics(result.project.diagnostics);
        }
    } catch (error) {
        writeDiagnostics(error.diagnostics);

        throw error;
    }

    function writeDiagnostics(diagnostics: DiagnosticBag | undefined) {
        if (diagnostics) {
            const filteredDiagnostics: Diagnostic[] = [];
            for (const diagnostic of diagnostics) {
                // TODO: Need proper handling for severity
                if (diagnostic.kind === LOG_LEVEL) {
                    filteredDiagnostics.push(diagnostic);
                }
            }

            if (filteredDiagnostics.length) {
                const diagnosticsOutput = filteredDiagnostics.map((diagnostic) =>
                    diagnostic.message
                ).join(os.EOL);

                outputPath = replaceExt(outputPath, '.yaml');
                fs.writeFileSync(outputPath, diagnosticsOutput);
            }
        }
    }
}

export function executePreprocessorTokenizerTestCases(name: string, casesPath: string): void {
    executeTestCases({
        name: name,
        casesPath: casesPath,
        testCallback: function (context) {
            const { _it, sourceRelativePath, contents } = context;

            _it(sourceRelativePath, function () {
                let outputPath = path.resolve(__dirname, 'cases', name, sourceRelativePath);
                outputPath = replaceExt(outputPath, '.tokens.json');

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
                let outputPath = path.resolve(__dirname, 'cases', name, sourceRelativePath);
                outputPath = replaceExt(outputPath, '.parse.json');

                executeBaselineTestCase(outputPath, () => {
                    return getPreprocessorParseTree(sourceRelativePath, contents);
                }, function (key, value) {
                    switch (key) {
                        case 'filePath':
                        case 'document':
                        case 'parent': {
                            return undefined;
                        }
                    }

                    return value;
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
                let outputPath = path.resolve(__dirname, 'cases', name, sourceRelativePath);
                outputPath = replaceExt(outputPath, '.tokens.json');

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
                let outputPath = path.resolve(__dirname, 'cases', name, sourceRelativePath);
                outputPath = replaceExt(outputPath, '.parse.json');

                executeBaselineTestCase(outputPath, () => {
                    return getParseTree(sourceRelativePath, contents);
                }, function (key, value) {
                    switch (key) {
                        case 'preprocessorModuleDeclaration':
                        case 'parent':
                        case 'parseDiagnostics':
                        case 'locals': {
                            return undefined;
                        }
                    }

                    return value;
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
                let outputPath = path.resolve(__dirname, 'cases', name, sourceRelativePath);
                outputPath = replaceExt(outputPath, '.bound.json');

                executeBaselineTestCase(outputPath, () => {
                    return getBoundTree(path.resolve(casesPath, sourceRelativePath), contents);
                }, function (this: any, key, value) {
                    if (!value) {
                        return value;
                    }

                    switch (this.kind) {
                        case BoundNodeKind.ModuleDeclaration: {
                            switch (key) {
                                case 'type': {
                                    return undefined;
                                }
                            }
                        }
                    }

                    switch (key) {
                        case 'project':
                        case 'directory':
                        case 'parent':
                        case 'openType':
                        case 'frameworkModule': {
                            return undefined;
                        }
                        case 'declaration': {
                            if (value.kind === BoundNodeKind.ModuleDeclaration &&
                                value.identifier
                            ) {
                                return value.identifier.name;
                            }

                            return undefined;
                        }
                        case 'identifier': {
                            const identifier = value as BoundDeclarations[typeof key];

                            return identifier.name;
                        }
                        case 'typeParameters': {
                            const typeParameters = value as BoundClassDeclaration[typeof key];

                            return typeParameters!.map((typeParameter) =>
                                typeParameter.identifier.name
                            );
                        }
                        case 'typeArguments': {
                            const typeArguments = value as BoundClassDeclaration[typeof key];

                            return typeArguments!.map((typeArgument) =>
                                typeArgument.type
                            );
                        }
                        case 'superType':
                        case 'returnType':
                        case 'typeAnnotation':
                        case 'typeReference': {
                            return value.type.toString();
                        }
                        case 'implementedTypes': {
                            const implementedTypes = value as (BoundClassDeclaration | BoundInterfaceDeclaration)[typeof key];
                            if (implementedTypes) {
                                return implementedTypes.map((implementedType) =>
                                    implementedType.type.toString()
                                );
                            }
                            break;
                        }
                        case 'locals': {
                            const scope = this as Scope;
                            const locals = value as typeof scope[typeof key];

                            switch (scope.kind) {
                                case BoundNodeKind.ModuleDeclaration:
                                case BoundNodeKind.ExternClassDeclaration:
                                case BoundNodeKind.InterfaceDeclaration:
                                case BoundNodeKind.ClassDeclaration: {
                                    return Array.from(locals).filter((identifier) => {
                                        if (identifier.declaration.kind === BoundNodeKind.ModuleDeclaration) {
                                            const modulePath = getModulePath(identifier.declaration);

                                            return modulePath !== 'monkey.lang';
                                        }

                                        return true;
                                    }).map((identifier) => {
                                        if (identifier.declaration.kind === BoundNodeKind.ModuleDeclaration) {
                                            return {
                                                kind: identifier.declaration.kind,
                                                identifier,
                                                path: getModulePath(identifier.declaration),
                                            };
                                        }

                                        return identifier.declaration;
                                    });
                                }
                            }

                            return Array.from(locals).map((identifier) =>
                                identifier.name
                            );

                            function getModulePath(boundModule: BoundModuleDeclaration) {
                                const components: string[] = [];

                                let directory: BoundDirectory | undefined = boundModule.directory;
                                while (directory) {
                                    components.unshift(directory.identifier.name);
                                    directory = directory.parent as BoundDirectory | undefined;
                                }

                                components.shift(); // Take off root directory

                                if (boundModule.identifier.name !== components[components.length - 1]) {
                                    components.push(boundModule.identifier.name);
                                }

                                return components.join('.');
                            }
                        }
                        case 'target': {
                            const target = value as BoundAliasDirective[typeof key];

                            return {
                                kind: target.kind,
                                identifier: target.identifier,
                            };
                        }
                        case 'overloads': {
                            const overloads = value as BoundFunctionLikeGroupDeclaration[typeof key];

                            return Array.from(overloads.values() as IterableIterator<any>);
                        }
                    }

                    if (value instanceof Type) {
                        return value.toString();
                    }

                    if (value instanceof Set) {
                        return Array.from(value.values());
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
        TARGET: 'glfw3',
        CONFIG: 'release',
    };

    return tokenizer.getTokens(preprocessorModuleDeclaration, configVars);
}

export function getParseTree(filePath: string, document: string): ModuleDeclaration {
    const preprocessorModuleDeclaration = getPreprocessorParseTree(filePath, document);
    const tokenizer = new Tokenizer();
    const configVars: ConfigurationVariables = {
        HOST: 'winnt',
        LANG: 'cpp',
        TARGET: 'glfw3',
        CONFIG: 'release',
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
    const project = new Project(frameworkDirectory, projectDirectory, {
        HOST: 'winnt',
        LANG: 'cpp',
        TARGET: 'glfw3',
        CONFIG: 'debug',
    });

    try {
        return project.importModule(filePath);
    } catch (error) {
        error.diagnostics = project.diagnostics;

        throw error;
    }
}

function replaceExt(originalPath: string, ext: string): string {
    const pathObj = path.parse(originalPath);
    pathObj.base = '';
    pathObj.ext = ext;

    return path.format(pathObj);
}
