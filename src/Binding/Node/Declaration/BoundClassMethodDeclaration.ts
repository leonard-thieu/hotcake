import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { MethodType } from '../../Type/FunctionLikeType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundStatements } from '../Statement/BoundStatements';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundTypeDeclaration } from './BoundDeclarations';

export class BoundClassMethodDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ClassMethodDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: MethodType = undefined!;

    returnType: BoundTypeDeclaration = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;
    statements?: BoundStatements[] = undefined;
}
