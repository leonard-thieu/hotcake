import fs = require('fs');
import path = require('path');
import { assertNever } from './assertNever';
import { Binder } from './Binding/Binder';
import { BoundSymbol, BoundSymbolTable } from './Binding/BoundSymbol';
import { BoundNodeKind } from './Binding/Node/BoundNodeKind';
import { BoundDirectory } from './Binding/Node/Declaration/BoundDirectory';
import { BoundModuleDeclaration } from './Binding/Node/Declaration/BoundModuleDeclaration';
import { ArrayType } from './Binding/Type/ArrayType';
import { FunctionLikeType } from './Binding/Type/FunctionLikeType';
import { ObjectType } from './Binding/Type/ObjectType';
import { StringType } from './Binding/Type/StringType';
import { TypeKind } from './Binding/Type/TypeKind';
import { TypeParameterType } from './Binding/Type/TypeParameterType';
import { Types } from './Binding/Type/Types';
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
    }

    readonly boundFrameworkModulesDirectory: BoundDirectory;
    readonly boundProjectDirectory: BoundDirectory;

    readonly stringType = new StringType();

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
        const binder = new Binder();
        const boundModuleDeclaration = binder.bind(moduleDeclaration, this, boundModuleDirectory, moduleIdentifier);

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

    // #region Array types

    private readonly arrayTypes = new Map<Types, ArrayType>();

    /**
     * Ensures only a single type is created for each unique array type.
     */
    getArrayType(type: Types): ArrayType {
        let arrayType = this.arrayTypes.get(type);
        if (!arrayType) {
            arrayType = new ArrayType(type);
            this.arrayTypes.set(type, arrayType);
        }

        return arrayType;
    }

    // #endregion

    // #region Generic types

    private readonly closedTypes = new Map<Types, ClosedTypeInfo[]>();

    closeType(openType: Types, typeMap: Map<TypeParameterType, Types>): Types {
        // Breaks infinite loops when a type references itself
        const closedTypeInfos = this.closedTypes.get(openType);
        if (closedTypeInfos) {
            const closedTypeInfo = this.getClosedTypeInfo(closedTypeInfos, Array.from(typeMap.values()));
            if (closedTypeInfo) {
                return closedTypeInfo.closedType;
            }
        }

        switch (openType.kind) {
            case TypeKind.Bool:
            case TypeKind.Int:
            case TypeKind.Float:
            case TypeKind.String: {
                return openType;
            }
            case TypeKind.TypeParameter: {
                return typeMap.get(openType)!;
            }
            case TypeKind.Object: {
                return this.closeObjectType(openType, typeMap);
            }
            case TypeKind.Array: {
                return this.getArrayType(this.closeType(openType.elementType, typeMap));
            }
            case TypeKind.FunctionLike: {
                return this.closeFunctionLikeType(openType, typeMap);
            }
            case TypeKind.Module:
            case TypeKind.FunctionLikeGroup:
            case TypeKind.Void: {
                throw new Error(`Cannot close '${openType.kind}' type.`);
            }
            default: {
                return assertNever(openType);
            }
        }
    }

    private getClosedTypeInfo(
        closedTypeInfos: ClosedTypeInfo[],
        typeArguments: Types[],
    ): ClosedTypeInfo | undefined {
        for (const closedTypeInfo of closedTypeInfos) {
            let isCached = true;

            for (let i = 0; i < closedTypeInfo.typeArguments.length; i++) {
                if (closedTypeInfo.typeArguments[i] !== typeArguments[i]) {
                    isCached = false;
                    break;
                }
            }

            if (isCached) {
                return closedTypeInfo;
            }
        }
    }

    private setClosedTypeInfo(
        openType: Types,
        typeArguments: Types[],
        closedType: Types,
    ): void {
        let closedTypeInfos = this.closedTypes.get(openType);

        if (!closedTypeInfos) {
            closedTypeInfos = [];
            this.closedTypes.set(openType, closedTypeInfos);
        }

        closedTypeInfos.push({
            typeArguments,
            closedType,
        });
    }

    private closeObjectType(openType: ObjectType, typeMap: Map<TypeParameterType, Types>): ObjectType {
        const closedType = new ObjectType();
        this.setClosedTypeInfo(openType, Array.from(typeMap.values()), closedType);
        closedType.declaration = openType.declaration;
        closedType.identifier = openType.identifier;

        // TODO: Close super type?
        // TODO: Close implemented types?
        // TODO: Assert matching number of type parameters/arguments?

        if (openType.typeParameters) {
            const typeParameters: TypeParameterType[] = [];

            for (const typeParameter of openType.typeParameters) {
                const typeArgument = typeMap.get(typeParameter)!;
                if (typeArgument.kind === TypeKind.TypeParameter) {
                    typeParameters.push(typeArgument);
                }
            }

            closedType.typeParameters = typeParameters;
        }

        return closedType;
    }

    private closeFunctionLikeType(openType: FunctionLikeType, typeMap: Map<TypeParameterType, Types>): FunctionLikeType {
        const closedType = new FunctionLikeType();
        this.setClosedTypeInfo(openType, Array.from(typeMap.values()), closedType);
        closedType.returnType = this.closeType(openType.returnType, typeMap);

        const parameters: Types[] = [];

        for (const parameter of openType.parameters) {
            parameters.push(this.closeType(parameter, typeMap));
        }

        closedType.parameters = parameters;

        return closedType;
    }

    // #endregion
}

interface ClosedTypeInfo {
    typeArguments: Types[];
    closedType: Types;
}
