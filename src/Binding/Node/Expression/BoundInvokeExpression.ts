import { Type } from '../../Type/Type';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundInvokeExpression extends BoundExpression {
    constructor(
        type: Type,
        args: BoundExpression[],
    ) {
        super(BoundNodeKind.InvokeExpression, type);

        this.arguments = args;
    }

    readonly arguments: BoundExpression[];
}
