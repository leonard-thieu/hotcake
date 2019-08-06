import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { EndKeywordToken, WendKeywordToken, WhileKeywordToken } from '../../Token/Tokens';
import { MissableExpression } from '../Expression/Expressions';
import { NodeKind } from '../Nodes';
import { Statement, Statements } from './Statements';

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
    statements: (Statements | SkippedToken)[] = undefined!;
    endKeyword: MissableToken<WendKeywordToken | EndKeywordToken> = undefined!;
    endWhileKeyword?: WhileKeywordToken = undefined;
}
