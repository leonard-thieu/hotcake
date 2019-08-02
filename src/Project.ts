import fs = require('fs');
import path = require('path');
import { assertNever } from './assertNever';
import { Binder } from './Binding/Binder';
import { BoundSymbol, BoundSymbolTable } from './Binding/BoundSymbol';
import { BoundNodeKind } from './Binding/Node/BoundNodeKind';
import { BoundTypeReferenceDeclaration } from './Binding/Node/Declaration/BoundDeclarations';
import { BoundDirectory } from './Binding/Node/Declaration/BoundDirectory';
import { BoundIntrinsicTypeDeclaration } from './Binding/Node/Declaration/BoundIntrinsicTypeDeclaration';
import { BoundModuleDeclaration } from './Binding/Node/Declaration/BoundModuleDeclaration';
import { BoundExternClassDeclaration } from './Binding/Node/Declaration/Extern/BoundExternClassDeclaration';
import { BoolType } from './Binding/Type/BoolType';
import { FloatType } from './Binding/Type/FloatType';
import { IntType } from './Binding/Type/IntType';
import { NullType } from './Binding/Type/NullType';
import { VoidType } from './Binding/Type/VoidType';
import { Parser } from './Syntax/Parser';
import { PreprocessorParser } from './Syntax/PreprocessorParser';
import { PreprocessorTokenizer } from './Syntax/PreprocessorTokenizer';
import { IdentifierToken, PeriodToken } from './Syntax/Token/Token';
import { TokenKind } from './Syntax/Token/TokenKind';
import { Tokenizer } from './Syntax/Tokenizer';

const preprocessorTokenizer = new PreprocessorTokenizer();
const preprocessorParser = new PreprocessorParser();
const tokenizer = new Tokenizer();
const parser = new Parser();

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

        this.nullTypeDeclaration = new BoundIntrinsicTypeDeclaration();
        this.nullTypeDeclaration.identifier = new BoundSymbol('Null', this.nullTypeDeclaration);
        this.nullTypeDeclaration.type = new NullType(this.nullTypeDeclaration);

        this.voidTypeDeclaration = new BoundIntrinsicTypeDeclaration();
        this.voidTypeDeclaration.identifier = new BoundSymbol('Void', this.voidTypeDeclaration);
        this.voidTypeDeclaration.type = new VoidType(this.voidTypeDeclaration);

        this.boolTypeDeclaration = new BoundIntrinsicTypeDeclaration();
        this.boolTypeDeclaration.identifier = new BoundSymbol('Bool', this.boolTypeDeclaration);
        this.boolTypeDeclaration.type = new BoolType(this.boolTypeDeclaration);

        this.intTypeDeclaration = new BoundIntrinsicTypeDeclaration();
        this.intTypeDeclaration.identifier = new BoundSymbol('Int', this.intTypeDeclaration);
        this.intTypeDeclaration.type = new IntType(this.intTypeDeclaration);

        this.floatTypeDeclaration = new BoundIntrinsicTypeDeclaration();
        this.floatTypeDeclaration.identifier = new BoundSymbol('Float', this.floatTypeDeclaration);
        this.floatTypeDeclaration.type = new FloatType(this.floatTypeDeclaration);

        this.stringTypeDeclaration = new BoundExternClassDeclaration();

        this.arrayTypeDeclaration = new BoundExternClassDeclaration();
        this.arrayTypeDeclaration.identifier = new BoundSymbol('Array', this.arrayTypeDeclaration);

        this.objectTypeDeclaration = new BoundExternClassDeclaration();

        this.throwableTypeDeclaration = new BoundExternClassDeclaration();
    }

    readonly boundFrameworkModulesDirectory: BoundDirectory;
    readonly boundProjectDirectory: BoundDirectory;

    readonly nullTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly voidTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly boolTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly intTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly floatTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly stringTypeDeclaration: BoundExternClassDeclaration;
    readonly arrayTypeDeclaration: BoundExternClassDeclaration;
    readonly objectTypeDeclaration: BoundExternClassDeclaration;
    readonly throwableTypeDeclaration: BoundExternClassDeclaration;

    private readonly moduleCache = new Map<string, BoundModuleDeclaration>();
    readonly arrayTypeCache = new Map<BoundTypeReferenceDeclaration, BoundExternClassDeclaration>();

    cacheModule(boundModuleDeclaration: BoundModuleDeclaration): void {
        const { directory, identifier } = boundModuleDeclaration;
        const moduleFullPath = path.resolve(directory.fullPath, identifier.name + FILE_EXTENSION);
        this.moduleCache.set(moduleFullPath, boundModuleDeclaration);
    }

    importModuleFromSource(sourceModule: BoundModuleDeclaration, modulePathFromSource: string): BoundModuleDeclaration {
        const currentDirectory = sourceModule.directory.fullPath;
        const modulePathParts = modulePathFromSource.split('.');
        const modulePathComponents = modulePathParts.slice(0, modulePathParts.length - 1);
        const moduleIdentifier = modulePathParts[modulePathParts.length - 1];
        const boundModuleDirectory = this.resolveModuleDirectory(currentDirectory, modulePathComponents, moduleIdentifier);
        const modulePath = path.resolve(boundModuleDirectory.fullPath, moduleIdentifier + FILE_EXTENSION);

        return this.importModule(modulePath);
    }

    importModule(modulePath: string): BoundModuleDeclaration {
        let boundModuleDeclaration = this.moduleCache.get(modulePath);
        if (boundModuleDeclaration) {
            return boundModuleDeclaration;
        }

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
        const binder = new Binder();
        boundModuleDeclaration = binder.bind(moduleDeclaration, this, boundModuleDirectory, moduleIdentifier);

        return boundModuleDeclaration;
    }

    // #region Module path

    getModulePathComponents(
        modulePathChildren: (IdentifierToken | PeriodToken)[],
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
            relativePathComponents[0] === ''
        ) {
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

    // #endregion

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
                const declaration = existingSymbol.declaration!;
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

        const identifier = new BoundSymbol(name, boundDirectory);
        if (scope) {
            scope.locals.set(name, identifier);
        }
        boundDirectory.identifier = identifier;

        boundDirectory.fullPath = fullPath;

        return boundDirectory;
    }
}
