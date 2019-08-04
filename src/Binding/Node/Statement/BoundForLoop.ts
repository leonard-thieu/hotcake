import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
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
