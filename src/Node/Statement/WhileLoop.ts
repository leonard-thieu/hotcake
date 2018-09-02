import { ParseContextElementArray } from '../../ParserBase';
import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
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

    whileKeyword: Token;
    expression: Expressions | MissingToken;
    statements: ParseContextElementArray<WhileLoop['kind']>;
    endKeyword: Token;
    endWhileKeyword: Token | null = null;
}
