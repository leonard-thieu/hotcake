import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { EndKeywordToken, WendKeywordToken, WhileKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
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

    whileKeyword: WhileKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
    statements: ParseContextElementArray<WhileLoop['kind']> = undefined!;
    endKeyword: MissableToken<WendKeywordToken | EndKeywordToken> = undefined!;
    endWhileKeyword?: WhileKeywordToken = undefined;
}
