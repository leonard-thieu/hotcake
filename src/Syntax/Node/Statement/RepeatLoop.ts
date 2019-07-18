import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ForeverKeywordToken, RepeatKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export const RepeatLoopChildNames: ReadonlyArray<keyof RepeatLoop> = [
    'repeatKeyword',
    'statements',
    'foreverOrUntilKeyword',
    'untilExpression',
    'terminator',
];

export class RepeatLoop extends Statement {
    readonly kind = NodeKind.RepeatLoop;

    repeatKeyword: RepeatKeywordToken = undefined!;
    statements: ParseContextElementArray<RepeatLoop['kind']> = undefined!;
    foreverOrUntilKeyword: MissableToken<ForeverKeywordToken | UntilKeywordToken> = undefined!;
    untilExpression?: MissableExpression = undefined;
}
