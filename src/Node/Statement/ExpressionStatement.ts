import { MissableExpression } from '../Expression/Expression';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ExpressionStatement extends Statement {
    static CHILD_NAMES: (keyof ExpressionStatement)[] = [
        'expression',
        'terminator',
    ];

    readonly kind = NodeKind.ExpressionStatement;

    expression: MissableExpression = undefined!;

    get firstToken() {
        if (isNode(this.expression)) {
            return this.expression.firstToken;
        }

        return this.expression;
    }

    get lastToken() {
        if (this.terminator) {
            return this.terminator;
        }
        
        if (isNode(this.expression)) {
            return this.expression.lastToken;
        }

        return this.expression;
    }
}
