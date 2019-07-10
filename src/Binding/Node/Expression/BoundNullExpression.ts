import { ObjectType } from '../../Type/ObjectType';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundNullExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.NullExpression, ObjectType.nullType);
    }
}
