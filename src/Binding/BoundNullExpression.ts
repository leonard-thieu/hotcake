import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';
import { ObjectType } from './Type/ObjectType';

export class BoundNullExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.NullExpression, ObjectType.nullType);
    }
}
