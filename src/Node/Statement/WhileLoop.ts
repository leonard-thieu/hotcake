import { ParseContextElementArray } from '../../ParserBase';
import { EndKeywordToken, MissingExpressionToken, WendKeywordToken, WhileKeywordToken } from '../../Token/Token';
import { Expressions } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class WhileLoop extends Statement {
    static CHILD_NAMES: (keyof WhileLoop)[] = [
        'whileKeyword',
        'expression',
        'statements',
        'endKeyword',
        'endWhileKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.WhileLoop;

    whileKeyword: WhileKeywordToken;
    expression: Expressions | MissingExpressionToken;
    statements: ParseContextElementArray<WhileLoop['kind']>;
    endKeyword: WendKeywordToken | EndKeywordToken;
    endWhileKeyword: WhileKeywordToken | null = null;
}
