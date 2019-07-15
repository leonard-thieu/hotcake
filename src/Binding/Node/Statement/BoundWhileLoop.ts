import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundStatements } from './BoundStatements';

export class BoundWhileLoop extends BoundNode {
    readonly kind = BoundNodeKind.WhileLoop;

    locals: BoundSymbolTable = undefined!;

    expression: BoundExpressions = undefined!;
    statements: BoundStatements[] = undefined!;
}
