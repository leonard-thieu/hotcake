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
}
