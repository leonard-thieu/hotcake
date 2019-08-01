import { BoundNodeKind } from '../BoundNodeKind';
import { BoundClassDeclaration } from '../Declaration/BoundClassDeclaration';
import { BoundExternClassDeclaration } from '../Declaration/Extern/BoundExternClassDeclaration';
import { BoundExpression } from './BoundExpression';

export class BoundNewExpression extends BoundExpression {
    readonly kind = BoundNodeKind.NewExpression;

    typeReference: BoundExternClassDeclaration | BoundClassDeclaration = undefined!;
}
