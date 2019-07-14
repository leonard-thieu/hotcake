import { IntType } from '../../Type/IntType';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundIntegerLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.IntegerLiteralExpression;

    readonly type = IntType.type;
}
