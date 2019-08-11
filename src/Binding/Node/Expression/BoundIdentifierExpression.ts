import { BoundSymbol } from '../../BoundSymbol';
import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression } from './BoundExpressions';

export class BoundIdentifierExpression extends BoundExpression {
    readonly kind = BoundNodeKind.IdentifierExpression;

    identifier: BoundSymbol = undefined!;
}
