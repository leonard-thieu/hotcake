import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundStatements } from './BoundStatements';

export class BoundIfStatement extends BoundNode {
    readonly kind = BoundNodeKind.IfStatement;

    expression: BoundExpressions = undefined!;
    statements: BoundStatements[] = undefined!;
    elseIfClauses?: BoundElseIfClause[] = undefined;
    elseClause?: BoundElseClause = undefined;
}

export class BoundElseIfClause extends BoundNode {
    readonly kind = BoundNodeKind.ElseIfClause;

    expression: BoundExpressions = undefined!;
    statements: BoundStatements[] = undefined!;
}

export class BoundElseClause extends BoundNode {
    readonly kind = BoundNodeKind.ElseClause;

    statements: BoundStatements[] = undefined!;
}
