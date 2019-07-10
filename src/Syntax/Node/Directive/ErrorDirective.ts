import { ErrorDirectiveKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class ErrorDirective extends Directive {
    static CHILD_NAMES: (keyof ErrorDirective)[] = [
        'numberSign',
        'errorDirectiveKeyword',
        'expression',
    ];

    readonly kind = NodeKind.ErrorDirective;

    errorDirectiveKeyword: ErrorDirectiveKeywordToken = undefined!;
    expression: MissableExpression = undefined!;

    get lastToken() {
        if (isNode(this.expression)) {
            return this.expression.lastToken;
        }

        return this.expression;
    }
}
