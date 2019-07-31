import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { FunctionType } from '../../Type/FunctionLikeType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundStatements } from '../Statement/BoundStatements';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundTypeDeclaration } from './BoundDeclarations';

export class BoundFunctionDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.FunctionDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: FunctionType = undefined!;

    returnType: BoundTypeDeclaration = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;
    statements?: BoundStatements[] = undefined;
}
