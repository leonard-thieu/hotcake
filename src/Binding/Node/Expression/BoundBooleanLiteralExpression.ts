import { BoolType } from '../../Type/BoolType';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundBooleanLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.BooleanLiteralExpression, BoolType.type);
    }
}
