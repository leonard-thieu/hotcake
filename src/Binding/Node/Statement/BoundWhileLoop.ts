import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundStatements } from './BoundStatements';

export class BoundWhileLoop extends BoundNode {
    readonly kind = BoundNodeKind.WhileLoop;

    readonly locals = new BoundSymbolTable();

    expression: BoundExpressions = undefined!;
    statements: BoundStatements[] = undefined!;
}
