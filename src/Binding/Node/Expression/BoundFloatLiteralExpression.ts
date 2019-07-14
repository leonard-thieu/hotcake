import { FloatType } from '../../Type/FloatType';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundFloatLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.FloatLiteralExpression;

    readonly type = FloatType.type;
}
