import { SelfKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class SelfExpression extends Expression {
    static CHILD_NAMES: (keyof SelfExpression)[] = [
        'newlines',
        'selfKeyword',
    ];

    readonly kind = NodeKind.SelfExpression;

    selfKeyword: SelfKeywordToken;
}
