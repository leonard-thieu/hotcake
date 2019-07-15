import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDataDeclaration } from '../Declaration/BoundDataDeclaration';
import { BoundStatements } from './BoundStatements';

export class BoundTryStatement extends BoundNode {
    readonly kind = BoundNodeKind.TryStatement;

    statements: BoundStatements[] = undefined!;
    catchClauses: BoundCatchClause[] = undefined!;
}

export class BoundCatchClause extends BoundNode {
    readonly kind = BoundNodeKind.CatchClause;

    parameter: BoundDataDeclaration = undefined!;
    statements: BoundStatements[] = undefined!;
}
