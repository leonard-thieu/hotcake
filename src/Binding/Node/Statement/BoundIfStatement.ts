import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundStatements } from './BoundStatements';

export class BoundIfStatement extends BoundNode {
    readonly kind = BoundNodeKind.IfStatement;

    expression: BoundExpressions = undefined!;
    statements: BoundStatements[] = undefined!;
    elseIfStatements?: BoundElseIfStatement[] = undefined;
    elseStatement?: BoundElseStatement = undefined;
}

export class BoundElseIfStatement extends BoundNode {
    readonly kind = BoundNodeKind.ElseIfStatement;

    expression: BoundExpressions = undefined!;
    statements: BoundStatements[] = undefined!;
}

export class BoundElseStatement extends BoundNode {
    readonly kind = BoundNodeKind.ElseStatement;

    statements: BoundStatements[] = undefined!;
}
