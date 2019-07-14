import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundStatements } from './BoundStatements';
import { BoundDataDeclaration } from '../Declaration/BoundDataDeclaration';

export class BoundTryStatement extends BoundNode {
    readonly kind = BoundNodeKind.TryStatement;

    statements: BoundStatements[] = undefined!;
    catchStatements: BoundCatchStatement[] = undefined!;
}

export class BoundCatchStatement extends BoundNode {
    readonly kind = BoundNodeKind.CatchStatement;

    parameter: BoundDataDeclaration = undefined!;
    statements: BoundStatements[] = undefined!;
}
