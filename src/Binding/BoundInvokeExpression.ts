import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundInvokeExpression extends BoundExpression {
    constructor(
        type: string,
        args: BoundExpression[],
    ) {
        super(BoundNodeKind.InvokeExpression, type);

        this.arguments = args;
    }

    readonly arguments: BoundExpression[];
}
