import { FloatType } from '../../Type/FloatType';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundFloatLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.FloatLiteralExpression, FloatType.type);
    }
}
