import { ClassDeclaration } from '../../../Syntax/Node/Declaration/ClassDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { ObjectType } from '../../Type/ObjectType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundTypeReferenceDeclaration } from './BoundDeclarations';
import { BoundClassMethodGroupDeclaration, BoundFunctionGroupDeclaration } from './BoundFunctionLikeGroupDeclaration';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundTypeParameter } from './BoundTypeParameter';
import { BoundExternClassDeclaration } from './Extern/BoundExternClassDeclaration';

export class BoundClassDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ClassDeclaration;

    declaration: ClassDeclaration = undefined!;
    rootType?: BoundClassDeclaration = undefined;
    instantiatedTypes?: BoundClassDeclaration[] = undefined;

    identifier: BoundSymbol = undefined!;
    type: ObjectType = undefined!;

    typeParameters?: BoundTypeParameter[] = undefined;
    typeArguments?: BoundTypeReferenceDeclaration[] = undefined;
    superType?: BoundExternClassDeclaration | BoundClassDeclaration = undefined;
    implementedTypes?: BoundInterfaceDeclaration[] = undefined;

    readonly locals = new BoundSymbolTable();
}

export type BoundClassDeclarationMember =
    | BoundDataDeclaration
    | BoundFunctionGroupDeclaration
    | BoundClassMethodGroupDeclaration
    ;
