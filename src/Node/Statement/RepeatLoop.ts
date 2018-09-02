import { ParseContextElementArray } from '../../ParserBase';
import { ForeverKeywordToken, MissingExpressionToken, RepeatKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { Expressions } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class RepeatLoop extends Statement {
    static CHILD_NAMES: (keyof RepeatLoop)[] = [
        'repeatKeyword',
        'statements',
        'foreverOrUntilKeyword',
        'untilExpression',
        'terminator',
    ];

    readonly kind = NodeKind.RepeatLoop;

    repeatKeyword: RepeatKeywordToken;
    statements: ParseContextElementArray<RepeatLoop['kind']>;
    foreverOrUntilKeyword: ForeverKeywordToken | UntilKeywordToken;
    untilExpression: Expressions | MissingExpressionToken | null = null;
}
