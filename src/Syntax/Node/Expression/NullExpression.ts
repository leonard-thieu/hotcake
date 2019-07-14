import { NullKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class NullExpression extends Expression {
    static CHILD_NAMES: (keyof NullExpression)[] = [
        'newlines',
        'nullKeyword',
    ];

    readonly kind = NodeKind.NullExpression;

    nullKeyword: NullKeywordToken = undefined!;

    get firstToken() {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.nullKeyword;
    }

    get lastToken() {
        return this.nullKeyword;
    }
}
