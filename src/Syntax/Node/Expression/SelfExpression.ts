import { SelfKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class SelfExpression extends Expression {
    static CHILD_NAMES: (keyof SelfExpression)[] = [
        'newlines',
        'selfKeyword',
    ];

    readonly kind = NodeKind.SelfExpression;

    selfKeyword: SelfKeywordToken = undefined!;

    get firstToken() {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.selfKeyword;
    }

    get lastToken() {
        return this.selfKeyword;
    }
}
