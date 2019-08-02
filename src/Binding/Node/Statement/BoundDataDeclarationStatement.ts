import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDataDeclaration } from '../Declaration/BoundDataDeclaration';

export class BoundDataDeclarationStatement extends BoundNode {
    readonly kind = BoundNodeKind.DataDeclarationStatement;

    dataDeclaration: BoundDataDeclaration = undefined!;
}
