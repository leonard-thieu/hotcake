import { ClassDeclaration, ClassMethodDeclaration } from '../../../Syntax/Node/Declaration/ClassDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { MethodType } from '../../Type/FunctionLikeType';
import { ObjectType } from '../../Type/ObjectType';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundStatements } from '../Statement/BoundStatements';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundTypeReferenceDeclaration } from './BoundDeclarations';
import { BoundExternClassDeclaration } from './BoundExternClassDeclaration';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundTypeParameter } from './BoundTypeParameter';

// #region Bound class declaration

export class BoundClassDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ClassDeclaration;

    identifier: BoundSymbol = undefined!;
    type: ObjectType = undefined!;

    typeParameters?: BoundTypeParameter[] = undefined;
    typeArguments?: BoundTypeReferenceDeclaration[] = undefined;
    superType?: BoundExternClassDeclaration | BoundClassDeclaration = undefined;
    implementedTypes?: BoundInterfaceDeclaration[] = undefined;

    readonly locals = new BoundSymbolTable();

    declaration: ClassDeclaration = undefined!;
    openType?: BoundClassDeclaration = undefined;
    instantiatedTypes?: BoundClassDeclaration[] = undefined;
}

// #endregion

// #region Bound class method declaration

export class BoundClassMethodDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ClassMethodDeclaration;

    declaration?: ClassMethodDeclaration = undefined;

    identifier: BoundSymbol = undefined!;
    readonly locals = new BoundSymbolTable();
    type: MethodType = undefined!;

    returnType: BoundTypeReferenceDeclaration = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;
    isProperty: boolean = undefined!;
    statements?: BoundStatements[] = undefined;
}

// #endregion
