import { FalseKeywordToken, TrueKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class BooleanLiteral extends Expression {
    static CHILD_NAMES: (keyof BooleanLiteral)[] = [
        'newlines',
        'value',
    ];

    readonly kind = NodeKind.BooleanLiteral;

    value: BooleanLiteralValueToken = undefined!;
}

export type BooleanLiteralValueToken =
    TrueKeywordToken |
    FalseKeywordToken
    ;
