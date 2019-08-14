import { MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ForeverKeywordToken, RepeatKeywordToken, UntilKeywordToken } from '../../Token/Tokens';
import { Expressions } from '../Expression/Expressions';
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
    foreverOrUntilKeyword: ForeverKeywordToken | UntilKeywordToken | MissingToken = undefined!;
    untilExpression?: Expressions | MissingToken = undefined!;
}
