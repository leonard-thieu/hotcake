import { ObjectType } from '../../Type/ObjectType';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundNullExpression extends BoundExpression {
    readonly kind = BoundNodeKind.NullExpression;

    readonly type = ObjectType.nullType;
}
