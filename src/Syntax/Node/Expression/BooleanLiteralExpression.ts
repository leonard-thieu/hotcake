import { FalseKeywordToken, TrueKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class BooleanLiteralExpression extends Expression {
    static CHILD_NAMES: (keyof BooleanLiteralExpression)[] = [
        'newlines',
        'value',
    ];

    readonly kind = NodeKind.BooleanLiteralExpression;

    value: BooleanLiteralExpressionValueToken = undefined!;

    get firstToken() {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.value;
    }

    get lastToken() {
        return this.value;
    }
}

export type BooleanLiteralExpressionValueToken =
    | TrueKeywordToken
    | FalseKeywordToken
    ;
