import { SuperKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class SuperExpression extends Expression {
    static CHILD_NAMES: (keyof SuperExpression)[] = [
        'newlines',
        'superKeyword',
    ];

    readonly kind = NodeKind.SuperExpression;

    superKeyword: SuperKeywordToken = undefined!;

    get firstToken() {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.superKeyword;
    }

    get lastToken() {
        return this.superKeyword;
    }
}
