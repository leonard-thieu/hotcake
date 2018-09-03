import { MissingExpressionToken, ThrowKeywordToken } from '../../Token/Token';
import { Expressions } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ThrowStatement extends Statement {
    static CHILD_NAMES: (keyof ThrowStatement)[] = [
        'throwKeyword',
        'expression',
        'terminator',
    ];

    readonly kind = NodeKind.ThrowStatement;

    throwKeyword: ThrowKeywordToken;
    expression: Expressions | MissingExpressionToken;
}
