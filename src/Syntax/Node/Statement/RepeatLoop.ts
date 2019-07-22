import { BoundSymbolTable } from '../../../Binding/BoundSymbol';
import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ForeverKeywordToken, RepeatKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement, Statements } from './Statement';

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

    locals = new BoundSymbolTable();
}
