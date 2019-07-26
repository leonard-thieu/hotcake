import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { FunctionLikeType } from '../../Type/FunctionLikeType';
import { Types } from '../../Type/Types';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDataDeclaration } from './BoundDataDeclaration';

export class BoundInterfaceMethodDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.InterfaceMethodDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: FunctionLikeType = undefined!;

    returnType: Types = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;
}
