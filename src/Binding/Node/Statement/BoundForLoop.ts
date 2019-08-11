import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundAssignmentStatement } from './BoundAssignmentStatement';
import { BoundStatements } from './BoundStatements';

export class BoundForLoop extends BoundNode {
    readonly kind = BoundNodeKind.ForLoop;

    readonly locals = new BoundSymbolTable();

    firstValueStatement: BoundStatements = undefined!;
    lastValueExpression: BoundExpressions = undefined!;
    stepValueClause: BoundAssignmentStatement = undefined!;

    statements: BoundStatements[] = undefined!;
}
