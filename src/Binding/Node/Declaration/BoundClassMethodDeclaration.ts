import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { FunctionLikeType } from '../../Type/FunctionLikeType';
import { Types } from '../../Type/Types';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundStatements } from '../Statement/BoundStatements';
import { BoundDataDeclaration } from './BoundDataDeclaration';

export class BoundClassMethodDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ClassMethodDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: FunctionLikeType = undefined!;

    returnType: Types = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;
    statements?: BoundStatements[] = undefined;
}
