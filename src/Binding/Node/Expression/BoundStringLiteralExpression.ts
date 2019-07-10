import { StringType } from '../../Type/StringType';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundStringLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.StringLiteralExpression, StringType.type);
    }
}
