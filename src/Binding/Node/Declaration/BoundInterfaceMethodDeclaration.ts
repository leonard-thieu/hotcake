import { InterfaceMethodDeclaration } from '../../../Syntax/Node/Declaration/InterfaceMethodDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { MethodType } from '../../Type/FunctionLikeType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundTypeReferenceDeclaration } from './BoundDeclarations';

export class BoundInterfaceMethodDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.InterfaceMethodDeclaration;

    declaration: InterfaceMethodDeclaration = undefined!;

    identifier: BoundSymbol = undefined!;
    readonly locals = new BoundSymbolTable();
    type: MethodType = undefined!;

    returnType: BoundTypeReferenceDeclaration = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;
}
