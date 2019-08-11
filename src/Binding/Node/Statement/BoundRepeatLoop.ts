import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundStatements } from './BoundStatements';

export class BoundRepeatLoop extends BoundNode {
    readonly kind = BoundNodeKind.RepeatLoop;

    readonly locals = new BoundSymbolTable();

    untilExpression?: BoundExpressions = undefined;
    statements: BoundStatements[] = undefined!;
}
