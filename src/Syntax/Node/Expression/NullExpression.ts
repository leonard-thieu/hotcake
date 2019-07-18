import { NullKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class NullExpression extends Expression {
    readonly kind = NodeKind.NullExpression;

    nullKeyword: NullKeywordToken = undefined!;
}
