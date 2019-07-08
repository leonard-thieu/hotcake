import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';
import { Type } from './Type/Type';

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
