import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from '../Expression/BoundExpression';
import { BoundStatements } from './BoundStatements';

export class BoundSelectStatement extends BoundNode {
    readonly kind = BoundNodeKind.SelectStatement;

    expression: BoundExpression = undefined!;
    caseStatements: BoundCaseStatement[] = undefined!;
    defaultStatement?: BoundDefaultStatement = undefined;
}

export class BoundCaseStatement extends BoundNode {
    readonly kind = BoundNodeKind.CaseStatement;

    expressions: BoundExpression[] = undefined!;
    statements: BoundStatements[] = undefined!;
}

export class BoundDefaultStatement extends BoundNode {
    readonly kind = BoundNodeKind.DefaultStatement;

    statements: BoundStatements[] = undefined!;
}
