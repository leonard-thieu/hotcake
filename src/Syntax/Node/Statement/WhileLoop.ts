import { MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { EndKeywordToken, WendKeywordToken, WhileKeywordToken } from '../../Token/Tokens';
import { Expressions } from '../Expression/Expressions';
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
    expression: Expressions | MissingToken = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
    endKeyword: WendKeywordToken | EndKeywordToken | MissingToken = undefined!;
    endWhileKeyword?: WhileKeywordToken = undefined!;
}
