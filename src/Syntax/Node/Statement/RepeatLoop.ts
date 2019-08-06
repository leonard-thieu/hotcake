import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ForeverKeywordToken, RepeatKeywordToken, UntilKeywordToken } from '../../Token/Tokens';
import { MissableExpression } from '../Expression/Expressions';
import { NodeKind } from '../Nodes';
import { Statement, Statements } from './Statements';

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
    statements: (Statements | SkippedToken)[] = undefined!;
    foreverOrUntilKeyword: MissableToken<ForeverKeywordToken | UntilKeywordToken> = undefined!;
    untilExpression?: MissableExpression = undefined;
}
