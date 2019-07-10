import { StringType } from '../../Type/StringType';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundStringLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.StringLiteralExpression;

    readonly type = StringType.type;
}
