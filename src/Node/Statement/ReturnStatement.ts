import { ReturnKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ReturnStatement extends Statement {
    static CHILD_NAMES: (keyof ReturnStatement)[] = [
        'returnKeyword',
        'expression',
        'terminator',
    ];

    readonly kind = NodeKind.ReturnStatement;

    returnKeyword: ReturnKeywordToken = undefined!;
    expression?: MissableExpression = undefined;

    get firstToken() {
        return this.returnKeyword;
    }

    get lastToken() {
        if (this.terminator) {
            return this.terminator;
        }
        
        if (this.expression) {
            if (isNode(this.expression)) {
                return this.expression.lastToken;
            }

            return this.expression;
        }

        return this.returnKeyword;
    }
}
