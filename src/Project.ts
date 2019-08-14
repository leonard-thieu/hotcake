import fs = require('fs');
import path = require('path');
import { Binder } from './Binding/Binder';
import { BoundSymbol } from './Binding/BoundSymbol';
import { BoundNodeKind } from './Binding/Node/BoundNodes';
import { BoundTypeReferenceDeclaration } from './Binding/Node/Declaration/BoundDeclarations';
import { BoundDirectory } from './Binding/Node/Declaration/BoundDirectory';
import { BoundExternClassDeclaration } from './Binding/Node/Declaration/BoundExternClassDeclaration';
import { BoundIntrinsicTypeDeclaration } from './Binding/Node/Declaration/BoundIntrinsicTypeDeclaration';
import { BoundModuleDeclaration } from './Binding/Node/Declaration/BoundModuleDeclaration';
import { BoolType } from './Binding/Type/BoolType';
import { FloatType } from './Binding/Type/FloatType';
import { IntType } from './Binding/Type/IntType';
import { NullType } from './Binding/Type/NullType';
import { VoidType } from './Binding/Type/VoidType';
import { ConfigurationVariableMap, ConfigurationVariables } from './Configuration';
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
        configVars: ConfigurationVariables,
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

        this.configVars = new ConfigurationVariableMap(Object.entries(configVars));

        const target = this.configVars.get('TARGET');
        const targetDirectoryPath = path.resolve(this.frameworkTargetsDirectory.fullPath, target);
        this.targetDirectory = this.bindDirectory(target, targetDirectoryPath, this.frameworkTargetsDirectory);

        const targetModulesDirectoryName = 'modules';
        const targetModulesDirectoryPath = path.resolve(this.targetDirectory.fullPath, targetModulesDirectoryName);
        this.targetModulesDirectory = this.bindDirectory(targetModulesDirectoryName, targetModulesDirectoryPath, this.targetDirectory);

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
    private readonly targetDirectory: BoundDirectory;
    private readonly targetModulesDirectory: BoundDirectory;

    private readonly configVars: ConfigurationVariableMap;

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
        modulePathSegments: ReadonlyArray<string>,
        moduleName: string,
    ): BoundModuleDeclaration {
        const boundModuleDirectory = this.resolveModuleDirectory(currentDirectory, modulePathSegments, moduleName);
        const moduleFilePath = path.resolve(boundModuleDirectory.fullPath, moduleName + FILE_EXTENSION);

        return this.importModule(moduleFilePath);
    }

    // Location priority:
    //   1. Current directory (of importing module)
    //   2. Project directory
    //   3. Framework modules directory
    private resolveModuleDirectory(
        currentDirectory: BoundDirectory,
        segments: ReadonlyArray<string>,
        name: string,
    ): BoundDirectory {
        const moduleDirectoryPaths = [
            currentDirectory,
            this.projectDirectory,
            this.frameworkModulesDirectory,
            this.frameworkTargetsDirectory,
            this.targetModulesDirectory,
        ];

        for (const moduleDirectoryPath of moduleDirectoryPaths) {
            const moduleDirectory = this.resolveModuleDirectory2(moduleDirectoryPath, segments, name);
            if (moduleDirectory) {
                return moduleDirectory;
            }
        }

        segments = [
            ...segments,
            name,
        ];

        throw new Error(`Could not find module '${segments.join('.')}'.`);
    }

    // Tries to import module in directory (<root>/<name>.monkey)
    // If not found, then tries subdirectory with same name as module (<root>/<name>/<name>.monkey)
    private resolveModuleDirectory2(
        rootDirectory: BoundDirectory,
        segments: ReadonlyArray<string>,
        name: string,
    ): BoundDirectory | undefined {
        let moduleDirectory: BoundDirectory | undefined;

        moduleDirectory = this.resolveModuleDirectory3(rootDirectory, segments, name);
        if (moduleDirectory) {
            return moduleDirectory;
        }

        segments = [
            ...segments,
            name,
        ];

        moduleDirectory = this.resolveModuleDirectory3(rootDirectory, segments, name);
        if (moduleDirectory) {
            return moduleDirectory;
        }
    }

    // Validates the path and binds directories along the path
    private resolveModuleDirectory3(
        rootDirectory: BoundDirectory,
        segments: ReadonlyArray<string>,
        name: string,
    ): BoundDirectory | undefined {
        const moduleFilePath = path.resolve(
            rootDirectory.fullPath,
            ...segments,
            name + FILE_EXTENSION,
        );

        if (fs.existsSync(moduleFilePath)) {
            let boundDirectory = rootDirectory;

            for (const segment of segments) {
                const fullPath = path.resolve(boundDirectory.fullPath, segment);
                boundDirectory = this.bindDirectory(segment, fullPath, boundDirectory);
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
        const currentDirectoryPath = path.dirname(moduleFilePath);
        const boundModuleDirectory = this.bindModuleDirectory(currentDirectoryPath);

        const preprocessorTokens = preprocessorTokenizer.getTokens(document);
        const preprocessorModuleDeclaration = preprocessorParser.parse(moduleFilePath, document, preprocessorTokens);
        const tokens = tokenizer.getTokens(
            preprocessorModuleDeclaration,
            this.configVars,
            currentDirectoryPath,
            moduleFilePath,
        );
        const moduleDeclaration = parser.parse(preprocessorModuleDeclaration, tokens);

        const moduleName = path.basename(moduleFilePath, FILE_EXTENSION);
        const binder = new Binder();
        boundModuleDeclaration = binder.bind(moduleDeclaration, this, boundModuleDirectory, moduleName);

        return boundModuleDeclaration;
    }

    private bindModuleDirectory(currentDirectory: string) {
        const moduleDirectoryPaths = [
            this.projectDirectory,
            this.frameworkModulesDirectory,
            this.frameworkTargetsDirectory,
            this.targetModulesDirectory,
        ];

        for (const moduleDirectoryPath of moduleDirectoryPaths) {
            const relativePathSegments = this.getRelativePathSegments(moduleDirectoryPath.fullPath, currentDirectory);
            if (relativePathSegments[0] !== '..') {
                let boundDirectory = moduleDirectoryPath;

                for (const segment of relativePathSegments) {
                    const fullPath = path.resolve(boundDirectory.fullPath, segment);
                    boundDirectory = this.bindDirectory(segment, fullPath, boundDirectory);
                }

                return boundDirectory;
            }
        }

        throw new Error(`Module is not within the project or framework modules directory tree.`);
    }

    private getRelativePathSegments(baseDirectory: string, currentDirectory: string) {
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
            const boundDirectory = parent.locals.get(name, BoundNodeKind.Directory);
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
        const moduleFilePath = path.resolve(directory.fullPath, identifier.name + FILE_EXTENSION);
        this.moduleCache.set(moduleFilePath, boundModuleDeclaration);
    }

    // #endregion
}
