import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ForeverKeywordToken, RepeatKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { isNode } from '../Node';
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

    repeatKeyword: RepeatKeywordToken = undefined!;
    statements: ParseContextElementArray<RepeatLoop['kind']> = undefined!;
    foreverOrUntilKeyword: MissableToken<ForeverKeywordToken | UntilKeywordToken> = undefined!;
    untilExpression?: MissableExpression = undefined;

    get firstToken() {
        return this.repeatKeyword;
    }

    get lastToken() {
        if (this.terminator) {
            return this.terminator;
        }
        
        if (this.untilExpression) {
            if (isNode(this.untilExpression)) {
                return this.untilExpression.lastToken;
            }

            return this.untilExpression;
        }

        return this.foreverOrUntilKeyword;
    }
}
