import { BoundNodeKind } from '../BoundNodes';
import { BoundClassDeclaration } from '../Declaration/BoundClassDeclaration';
import { BoundExternClassDeclaration } from '../Declaration/Extern/BoundExternClassDeclaration';
import { BoundExpression } from './BoundExpressions';

export class BoundNewExpression extends BoundExpression {
    readonly kind = BoundNodeKind.NewExpression;

    typeReference: BoundExternClassDeclaration | BoundClassDeclaration = undefined!;
}
