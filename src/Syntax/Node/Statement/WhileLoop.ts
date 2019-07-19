import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { EndKeywordToken, WendKeywordToken, WhileKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export const WhileLoopChildNames: ReadonlyArray<keyof WhileLoop> = [
    'whileKeyword',
    'expression',
    'statements',
    'endKeyword',
    'endWhileKeyword',
    'terminator',
];

export class WhileLoop extends Statement {
    readonly kind = NodeKind.WhileLoop;

    whileKeyword: WhileKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
    statements: ParseContextElementArray<ParseContextKind.WhileLoop> = undefined!;
    endKeyword: MissableToken<WendKeywordToken | EndKeywordToken> = undefined!;
    endWhileKeyword?: WhileKeywordToken = undefined;
}
