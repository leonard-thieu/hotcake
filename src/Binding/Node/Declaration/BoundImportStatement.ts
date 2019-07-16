import { BoundModulePath } from '../BoundModulePath';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundStringLiteralExpression } from '../Expression/BoundStringLiteralExpression';

export class BoundImportStatement extends BoundNode {
    readonly kind = BoundNodeKind.ImportStatement;

    path: BoundStringLiteralExpression | BoundModulePath = undefined!;
}
