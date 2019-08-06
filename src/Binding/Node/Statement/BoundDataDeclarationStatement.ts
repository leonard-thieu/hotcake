import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundDataDeclaration } from '../Declaration/BoundDataDeclaration';

export class BoundDataDeclarationStatement extends BoundNode {
    readonly kind = BoundNodeKind.DataDeclarationStatement;

    dataDeclaration: BoundDataDeclaration = undefined!;
}
