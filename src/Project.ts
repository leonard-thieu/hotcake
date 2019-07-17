import fs = require('fs');
import path = require('path');
import { assertNever } from './assertNever';
import { Binder } from './Binding/Binder';
import { BoundSymbol, BoundSymbolTable } from './Binding/BoundSymbol';
import { BoundNodeKind } from './Binding/Node/BoundNodeKind';
import { BoundDirectory } from './Binding/Node/Declaration/BoundDirectory';
import { BoundModuleDeclaration } from './Binding/Node/Declaration/BoundModuleDeclaration';
import { Parser } from './Syntax/Parser';
import { ParseContextElementDelimitedSequence, ParseContextKind } from './Syntax/ParserBase';
import { PreprocessorParser } from './Syntax/PreprocessorParser';
import { PreprocessorTokenizer } from './Syntax/PreprocessorTokenizer';
import { TokenKind } from './Syntax/Token/TokenKind';
import { Tokenizer } from './Syntax/Tokenizer';

const preprocessorTokenizer = new PreprocessorTokenizer();
const preprocessorParser = new PreprocessorParser();
const tokenizer = new Tokenizer();
const parser = new Parser();
const binder = new Binder();

export const FILE_EXTENSION = '.monkey';

export class Project {
    constructor(
        private readonly frameworkDirectory: string,
        projectDirectory: string,
    ) {
        this.frameworkDirectory = path.resolve(frameworkDirectory);

        const frameworkModulesDirectory = path.resolve(this.frameworkDirectory, 'modules');
        this.boundFrameworkModulesDirectory = this.bindDirectory(frameworkModulesDirectory);

        this.boundProjectDirectory = this.bindDirectory(path.resolve(projectDirectory));
    }

    readonly boundFrameworkModulesDirectory: BoundDirectory;
    readonly boundProjectDirectory: BoundDirectory;

    importModule(modulePath: string): BoundModuleDeclaration {
        const document = fs.readFileSync(modulePath, 'utf8');
        const currentDirectory = path.dirname(modulePath);

        const preprocessorTokens = preprocessorTokenizer.getTokens(document);
        const preprocessorModuleDeclaration = preprocessorParser.parse(modulePath, document, preprocessorTokens);
        const tokens = tokenizer.getTokens(preprocessorModuleDeclaration, {
            HOST: 'winnt',
            LANG: 'cpp',
            TARGET: 'glfw',
            CONFIG: 'debug',
            CD: currentDirectory,
            MODPATH: modulePath,
        });
        const moduleDeclaration = parser.parse(preprocessorModuleDeclaration, tokens);

        const moduleIdentifier = path.basename(modulePath, FILE_EXTENSION);
        const boundModuleDirectory = this.resolveModuleDirectory(currentDirectory, [], moduleIdentifier);
        const boundModuleDeclaration = binder.bind(moduleDeclaration, this, boundModuleDirectory, moduleIdentifier);

        return boundModuleDeclaration;
    }

    getModulePathComponents(
        modulePathChildren: ParseContextElementDelimitedSequence<ParseContextKind.ModulePathSequence>,
        document: string,
    ): string[] {
        const modulePathComponents: string[] = [];

        for (const child of modulePathChildren) {
            switch (child.kind) {
                case TokenKind.Identifier: {
                    const modulePathComponent = child.getText(document);
                    modulePathComponents.push(modulePathComponent);
                    break;
                }
                case TokenKind.Period: { break; }
                default: {
                    assertNever(child);
                    break;
                }
            }
        }

        return modulePathComponents;
    }

    resolveModuleDirectory(
        currentDirectory: string,
        modulePathComponents: string[],
        moduleIdentifier: string,
    ): BoundDirectory {
        let modulePath: BoundDirectory | undefined;

        const relativePathComponents = path.relative(this.boundProjectDirectory.fullPath, currentDirectory).split(path.sep);
        if (relativePathComponents.length === 1 &&
            relativePathComponents[0] === '') {
            relativePathComponents.pop();
        }
        const pathComponents = [
            ...relativePathComponents,
            ...modulePathComponents,
        ];

        modulePath = this.resolveModuleDirectory2(this.boundProjectDirectory, pathComponents, moduleIdentifier);
        if (modulePath) {
            return modulePath;
        }

        if (currentDirectory !== this.boundProjectDirectory.fullPath) {
            modulePath = this.resolveModuleDirectory2(this.boundProjectDirectory, modulePathComponents, moduleIdentifier);
            if (modulePath) {
                return modulePath;
            }
        }

        modulePath = this.resolveModuleDirectory2(this.boundFrameworkModulesDirectory, modulePathComponents, moduleIdentifier);
        if (modulePath) {
            return modulePath;
        }

        // TODO: Handle importing monkeytarget.

        const components = [
            ...modulePathComponents,
            moduleIdentifier,
        ];

        throw new Error(`Could not load module '${components.join('.')}'.`);
    }

    private resolveModuleDirectory2(
        root: BoundDirectory,
        pathComponents: string[],
        moduleIdentifier: string,
    ): BoundDirectory | undefined {
        let modulePath: BoundDirectory | undefined;

        modulePath = this.resolveModuleDirectory3(root, pathComponents, moduleIdentifier);
        if (modulePath) {
            return modulePath;
        }

        pathComponents = [
            ...pathComponents,
            moduleIdentifier,
        ];

        modulePath = this.resolveModuleDirectory3(root, pathComponents, moduleIdentifier);
        if (modulePath) {
            return modulePath;
        }
    }

    private resolveModuleDirectory3(
        root: BoundDirectory,
        pathComponents: string[],
        moduleIdentifier: string,
    ): BoundDirectory | undefined {
        const moduleFilePath = path.join(root.fullPath, ...pathComponents, moduleIdentifier) + FILE_EXTENSION;
        if (this.moduleFilePathExists(moduleFilePath)) {
            let scope = root;
            for (const component of pathComponents) {
                const fullPath = path.join(scope.fullPath, component);
                scope = this.bindDirectory(fullPath, scope);
            }

            return scope;
        }
    }

    private readonly moduleFilePathCache: Map<string, boolean> = new Map<string, boolean>();

    private moduleFilePathExists(moduleFilePath: string) {
        let exists = this.moduleFilePathCache.get(moduleFilePath);

        if (typeof exists === 'undefined') {
            exists = fs.existsSync(moduleFilePath);
            this.moduleFilePathCache.set(moduleFilePath, exists);
        }

        return exists;
    }

    private bindDirectory(
        fullPath: string,
        scope?: {
            locals: BoundSymbolTable,
        },
    ): BoundDirectory {
        const fullPathComponents = fullPath.split(path.sep);
        const name = fullPathComponents[fullPathComponents.length - 1];

        if (scope) {
            const existingSymbol = scope.locals.get(name);
            if (existingSymbol) {
                const { declaration } = existingSymbol;
                switch (declaration.kind) {
                    case BoundNodeKind.Directory: {
                        return declaration;
                    }
                    default: {
                        throw new Error(`'${name}' should be '${BoundNodeKind.Directory}' but is '${declaration.kind}'.`);
                    }
                }
            }
        }

        const boundDirectory = new BoundDirectory();
        boundDirectory.locals = new BoundSymbolTable();

        const identifier = new BoundSymbol(name, boundDirectory);
        if (scope) {
            scope.locals.set(name, identifier);
        }
        boundDirectory.identifier = identifier;

        boundDirectory.fullPath = fullPath;

        return boundDirectory;
    }
}
