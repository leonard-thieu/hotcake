import { BoolType } from '../../Type/BoolType';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundBooleanLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.BooleanLiteralExpression;

    readonly type = BoolType.type;
}
