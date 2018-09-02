import { MissingToken } from '../../Token/MissingToken';
import { ReturnKeywordToken } from '../../Token/Token';
import { Expression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ReturnStatement extends Statement {
    static CHILD_NAMES: (keyof ReturnStatement)[] = [
        'returnKeyword',
        'expression',
        'terminator',
    ];

    readonly kind = NodeKind.ReturnStatement;

    returnKeyword: ReturnKeywordToken;
    expression: Expression | MissingToken | null = null;
}
