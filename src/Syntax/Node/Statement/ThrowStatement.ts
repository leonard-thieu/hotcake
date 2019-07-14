import { ThrowKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ThrowStatement extends Statement {
    static CHILD_NAMES: (keyof ThrowStatement)[] = [
        'throwKeyword',
        'expression',
        'terminator',
    ];

    readonly kind = NodeKind.ThrowStatement;

    throwKeyword: ThrowKeywordToken = undefined!;
    expression: MissableExpression = undefined!;

    get firstToken() {
        return this.throwKeyword;
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
