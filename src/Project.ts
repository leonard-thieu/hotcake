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
import { ConfigurationVariables } from './Configuration';
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
        frameworkDirectoryPath: string,
        projectDirectoryPath: string,
        { HOST, LANG, TARGET, CONFIG }: ConfigurationVariables,
    ) {
        frameworkDirectoryPath = path.resolve(frameworkDirectoryPath);

        const frameworkModulesDirectoryName = 'modules';
        const frameworkModulesDirectoryPath = path.resolve(frameworkDirectoryPath, frameworkModulesDirectoryName);
        this.frameworkModulesDirectory = this.bindDirectory(frameworkModulesDirectoryName, frameworkModulesDirectoryPath);

        // Does `transcc` actually use this? Specific targets will have their own directories referenced and the `targets`
        // directory only contains targets.
        const frameworkTargetsDirectoryName = 'targets';
        const frameworkTargetsDirectoryPath = path.resolve(frameworkDirectoryPath, frameworkTargetsDirectoryName);
        this.frameworkTargetsDirectory = this.bindDirectory(frameworkTargetsDirectoryName, frameworkTargetsDirectoryPath);

        projectDirectoryPath = path.resolve(projectDirectoryPath);
        const projectDirectoryPathComponents = projectDirectoryPath.split(path.sep);
        const projectDirectoryName = projectDirectoryPathComponents[projectDirectoryPathComponents.length - 1];
        this.projectDirectory = this.bindDirectory(projectDirectoryName, projectDirectoryPath);

        this.host = HOST;
        this.lang = LANG;
        this.target = TARGET;
        this.config = CONFIG;

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

    private readonly frameworkModulesDirectory: BoundDirectory;
    private readonly frameworkTargetsDirectory: BoundDirectory;
    private readonly projectDirectory: BoundDirectory;

    private host: string = undefined!;
    private lang: string = undefined!;

    // #region Target

    private targetDirectory: BoundDirectory = undefined!;
    private targetModulesDirectory: BoundDirectory = undefined!;

    private _target: string = undefined!;

    get target() {
        return this._target;
    }

    set target(target: string) {
        this._target = target;

        const targetDirectoryPath = path.resolve(this.frameworkTargetsDirectory.fullPath, target);
        this.targetDirectory = this.bindDirectory(target, targetDirectoryPath, this.frameworkTargetsDirectory);

        const targetModulesDirectoryName = 'modules';
        const targetModulesDirectoryPath = path.resolve(this.targetDirectory.fullPath, targetModulesDirectoryName);
        this.targetModulesDirectory = this.bindDirectory(targetModulesDirectoryName, targetModulesDirectoryPath, this.targetDirectory);
    }

    // #endregion

    private config: string = undefined!;

    readonly nullTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly voidTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly boolTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly intTypeDeclaration: BoundIntrinsicTypeDeclaration;
    readonly floatTypeDeclaration: BoundIntrinsicTypeDeclaration;
    stringTypeDeclaration: BoundExternClassDeclaration = undefined!;
    arrayTypeDeclaration: BoundExternClassDeclaration = undefined!;
    objectTypeDeclaration: BoundExternClassDeclaration = undefined!;
    throwableTypeDeclaration: BoundExternClassDeclaration = undefined!;

    readonly arrayTypeCache = new Map<BoundTypeReferenceDeclaration, BoundExternClassDeclaration>();

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
        const modulePaths = [
            currentDirectory,
            this.projectDirectory,
            this.frameworkModulesDirectory,
            this.frameworkTargetsDirectory,
            this.targetModulesDirectory,
        ];

        for (const modulePath of modulePaths) {
            const moduleDirectory = this.resolveModuleDirectory2(modulePath, modulePathComponents, moduleName);
            if (moduleDirectory) {
                return moduleDirectory;
            }
        }

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
            HOST: this.host,
            LANG: this.lang,
            TARGET: this.target,
            CONFIG: this.config,
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
        const modulePaths = [
            this.projectDirectory,
            this.frameworkModulesDirectory,
            this.frameworkTargetsDirectory,
            this.targetModulesDirectory,
        ];

        for (const modulePath of modulePaths) {
            const relativePathComponents = this.getRelativePathComponents(modulePath.fullPath, currentDirectory);
            if (relativePathComponents[0] !== '..') {
                let boundDirectory = modulePath;

                for (const component of relativePathComponents) {
                    const fullPath = path.resolve(boundDirectory.fullPath, component);
                    boundDirectory = this.bindDirectory(component, fullPath, boundDirectory);
                }

                return boundDirectory;
            }
        }

        throw new Error(`Module is not within the project or framework modules directory tree.`);
    }

    private getRelativePathComponents(baseDirectory: string, currentDirectory: string) {
        const relativePath = path.relative(baseDirectory, currentDirectory);
        if (relativePath === '') {
            return [];
        }

        return relativePath.split(path.sep);
    }

    // #endregion

    private bindDirectory(
        name: string,
        fullPath: string,
        parent?: BoundDirectory,
    ): BoundDirectory {
        if (parent) {
            const boundDirectory = parent.locals.getDeclaration(name, BoundNodeKind.Directory);
            if (boundDirectory) {
                return boundDirectory;
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

    // #region Module cache

    private readonly moduleCache = new Map<string, BoundModuleDeclaration>();

    cacheModule(boundModuleDeclaration: BoundModuleDeclaration): void {
        const { directory, identifier } = boundModuleDeclaration;
        const moduleFullPath = path.resolve(directory.fullPath, identifier.name + FILE_EXTENSION);
        this.moduleCache.set(moduleFullPath, boundModuleDeclaration);
    }

    // #endregion
}
