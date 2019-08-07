import fs = require('fs');
import path = require('path');
import { Binder } from './Binding/Binder';
import { BoundSymbol } from './Binding/BoundSymbol';
import { BoundNodeKind } from './Binding/Node/BoundNodes';
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
import { DiagnosticBag } from './Diagnostics';
import { Parser } from './Syntax/Parser';
import { PreprocessorParser } from './Syntax/PreprocessorParser';
import { PreprocessorTokenizer } from './Syntax/PreprocessorTokenizer';
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

        const frameworkModulesDirectoryName = 'modules';
        const frameworkModulesDirectory = path.resolve(this.frameworkDirectory, frameworkModulesDirectoryName);
        this.boundFrameworkModulesDirectory = this.bindDirectory(frameworkModulesDirectoryName, frameworkModulesDirectory);

        projectDirectory = path.resolve(projectDirectory);
        const projectDirectoryComponents = projectDirectory.split(path.sep);
        const projectDirectoryName = projectDirectoryComponents[projectDirectoryComponents.length - 1];
        this.boundProjectDirectory = this.bindDirectory(projectDirectoryName, projectDirectory);

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
    }

    readonly diagnostics = new DiagnosticBag();

    readonly boundFrameworkModulesDirectory: BoundDirectory;
    readonly boundProjectDirectory: BoundDirectory;

    readonly nullTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly voidTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly boolTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly intTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly floatTypeDeclaration: BoundIntrinsicTypeDeclaration;
    stringTypeDeclaration: BoundExternClassDeclaration = undefined!;
    arrayTypeDeclaration: BoundExternClassDeclaration = undefined!;
    objectTypeDeclaration: BoundExternClassDeclaration = undefined!;
    throwableTypeDeclaration: BoundExternClassDeclaration = undefined!;

    private readonly moduleCache = new Map<string, BoundModuleDeclaration>();
    readonly arrayTypeCache = new Map<BoundTypeReferenceDeclaration, BoundExternClassDeclaration>();

    getLangModule(): BoundModuleDeclaration {
        const monkeyDirectory = this.boundFrameworkModulesDirectory.locals.get('monkey')!.declaration as BoundDirectory;

        return monkeyDirectory.locals.get('lang')!.declaration as BoundModuleDeclaration;
    }

    cacheModule(boundModuleDeclaration: BoundModuleDeclaration): void {
        const { directory, identifier } = boundModuleDeclaration;
        const moduleFullPath = path.resolve(directory.fullPath, identifier.name + FILE_EXTENSION);
        this.moduleCache.set(moduleFullPath, boundModuleDeclaration);
    }

    // #region Import module by path

    importModule(moduleFilePath: string): BoundModuleDeclaration {
        moduleFilePath = path.resolve(moduleFilePath);

        let boundModuleDeclaration = this.moduleCache.get(moduleFilePath);
        if (boundModuleDeclaration) {
            return boundModuleDeclaration;
        }

        const document = fs.readFileSync(moduleFilePath, 'utf8');
        const currentDirectory = path.dirname(moduleFilePath);
        const boundModuleDirectory = this.bindModuleDirectory(currentDirectory);

        const preprocessorTokens = preprocessorTokenizer.getTokens(document);
        const preprocessorModuleDeclaration = preprocessorParser.parse(moduleFilePath, document, preprocessorTokens);
        const tokens = tokenizer.getTokens(preprocessorModuleDeclaration, {
            HOST: 'winnt',
            LANG: 'cpp',
            TARGET: 'glfw',
            CONFIG: 'debug',
            CD: currentDirectory,
            MODPATH: moduleFilePath,
        });
        const moduleDeclaration = parser.parse(preprocessorModuleDeclaration, tokens);

        const moduleIdentifier = path.basename(moduleFilePath, FILE_EXTENSION);
        const binder = new Binder();
        boundModuleDeclaration = binder.bind(moduleDeclaration, this, boundModuleDirectory, moduleIdentifier);

        return boundModuleDeclaration;
    }

    private bindModuleDirectory(currentDirectory: string) {
        let root: BoundDirectory;
        let relativePathComponents: string[];

        relativePathComponents = this.getRelativePathComponents(this.boundProjectDirectory.fullPath, currentDirectory);
        if (relativePathComponents[0] !== '..') {
            root = this.boundProjectDirectory;
        } else {
            relativePathComponents = this.getRelativePathComponents(this.boundFrameworkModulesDirectory.fullPath, currentDirectory);
            if (relativePathComponents[0] !== '..') {
                root = this.boundFrameworkModulesDirectory;
            } else {
                throw new Error(`Module is not within the project or framework modules directory tree.`);
            }
        }

        let boundDirectory = root;

        for (const component of relativePathComponents) {
            const fullPath = path.resolve(boundDirectory.fullPath, component);
            boundDirectory = this.bindDirectory(component, fullPath, boundDirectory);
        }

        return boundDirectory;
    }

    private getRelativePathComponents(baseDirectory: string, currentDirectory: string) {
        const relativePath = path.relative(baseDirectory, currentDirectory);
        if (relativePath === '') {
            return [];
        }

        return relativePath.split(path.sep);
    }

    // #endregion

    // #region Import module from source

    importModuleFromSource(
        currentDirectory: BoundDirectory,
        modulePathComponents: string[],
        moduleName: string,
    ): BoundModuleDeclaration {
        const boundModuleDirectory = this.resolveModuleDirectory(currentDirectory, modulePathComponents, moduleName);
        const moduleFilePath = path.resolve(boundModuleDirectory.fullPath, moduleName + FILE_EXTENSION);

        return this.importModule(moduleFilePath);
    }

    // Location priority:
    //   1. Current directory (of importing module)
    //   2. Project directory
    //   3. Framework modules directory
    private resolveModuleDirectory(
        currentDirectory: BoundDirectory,
        modulePathComponents: string[],
        moduleName: string,
    ): BoundDirectory {
        let moduleDirectory: BoundDirectory | undefined;

        moduleDirectory = this.resolveModuleDirectory2(currentDirectory, modulePathComponents, moduleName);
        if (moduleDirectory) {
            return moduleDirectory;
        }

        moduleDirectory = this.resolveModuleDirectory2(this.boundProjectDirectory, modulePathComponents, moduleName);
        if (moduleDirectory) {
            return moduleDirectory;
        }

        moduleDirectory = this.resolveModuleDirectory2(this.boundFrameworkModulesDirectory, modulePathComponents, moduleName);
        if (moduleDirectory) {
            return moduleDirectory;
        }

        // TODO: Handle importing monkeytarget.

        const components = [
            ...modulePathComponents,
            moduleName,
        ];

        throw new Error(`Could not find module '${components.join('.')}'.`);
    }

    // Tries to import module in directory (<root>/<name>.monkey)
    // If not found, then tries subdirectory with same name as module (<root>/<name>/<name>.monkey)
    private resolveModuleDirectory2(
        root: BoundDirectory,
        pathComponents: string[],
        name: string,
    ): BoundDirectory | undefined {
        let modulePath: BoundDirectory | undefined;

        modulePath = this.resolveModuleDirectory3(root, pathComponents, name);
        if (modulePath) {
            return modulePath;
        }

        pathComponents = [
            ...pathComponents,
            name,
        ];

        modulePath = this.resolveModuleDirectory3(root, pathComponents, name);
        if (modulePath) {
            return modulePath;
        }
    }

    // Validates the path and binds directories along the path
    private resolveModuleDirectory3(
        root: BoundDirectory,
        pathComponents: string[],
        moduleIdentifier: string,
    ): BoundDirectory | undefined {
        const moduleFilePath = path.resolve(
            root.fullPath,
            ...pathComponents,
            moduleIdentifier + FILE_EXTENSION,
        );

        if (fs.existsSync(moduleFilePath)) {
            let boundDirectory = root;

            for (const component of pathComponents) {
                const fullPath = path.resolve(boundDirectory.fullPath, component);
                boundDirectory = this.bindDirectory(component, fullPath, boundDirectory);
            }

            return boundDirectory;
        }
    }

    // #endregion

    private bindDirectory(
        name: string,
        fullPath: string,
        parent?: BoundDirectory,
    ): BoundDirectory {
        if (parent) {
            const existingSymbol = parent.locals.get(name);
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
        boundDirectory.parent = parent;
        boundDirectory.identifier = new BoundSymbol(name, boundDirectory);

        if (parent) {
            parent.locals.set(boundDirectory.identifier);
        }

        boundDirectory.fullPath = fullPath;

        return boundDirectory;
    }
}
