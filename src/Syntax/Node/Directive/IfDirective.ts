import { ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ElseDirectiveKeywordToken, ElseIfDirectiveKeywordToken, EndDirectiveKeywordToken, IfDirectiveKeywordToken, NumberSignToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class IfDirective extends Directive {
    static CHILD_NAMES: (keyof IfDirective)[] = [
        'numberSign',
        'ifDirectiveKeyword',
        'expression',
        'members',
        'elseIfDirectives',
        'elseDirective',
        'endDirectiveNumberSign',
        'endDirectiveKeyword',
        'endIfDirectiveKeyword',
    ];

    readonly kind = NodeKind.IfDirective;

    ifDirectiveKeyword: IfDirectiveKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
    members: ParseContextElementSequence<IfDirective['kind']> = undefined!;
    elseIfDirectives: ParseContextElementSequence<ParseContextKind.ElseIfDirectiveList> = undefined!;
    elseDirective?: ElseDirective = undefined;
    endDirectiveNumberSign: MissableToken<NumberSignToken> = undefined!;
    endDirectiveKeyword: MissableToken<EndDirectiveKeywordToken> = undefined!;
    endIfDirectiveKeyword?: IfDirectiveKeywordToken = undefined;

    get lastToken() {
        if (this.endIfDirectiveKeyword) {
            return this.endIfDirectiveKeyword;
        }

        return this.endDirectiveKeyword;
    }
}

export class ElseIfDirective extends Directive {
    static CHILD_NAMES: (keyof ElseIfDirective)[] = [
        'numberSign',
        'elseIfDirectiveKeyword',
        'ifDirectiveKeyword',
        'expression',
        'members',
    ];

    readonly kind = NodeKind.ElseIfDirective;

    elseIfDirectiveKeyword: ElseIfDirectiveKeywordToken | ElseDirectiveKeywordToken = undefined!;
    ifDirectiveKeyword?: IfDirectiveKeywordToken = undefined;
    expression: MissableExpression = undefined!;
    members: ParseContextElementSequence<ElseIfDirective['kind']> = undefined!;

    get lastToken() {
        if (this.members.length !== 0) {
            const lastMember = this.members[this.members.length - 1];
            if (isNode(lastMember)) {
                return lastMember.lastToken;
            }

            return lastMember;
        }

        if (isNode(this.expression)) {
            return this.expression.lastToken;
        }

        return this.expression;
    }
}

export class ElseDirective extends Directive {
    static CHILD_NAMES: (keyof ElseDirective)[] = [
        'numberSign',
        'elseDirectiveKeyword',
        'members',
    ];

    readonly kind = NodeKind.ElseDirective;

    elseDirectiveKeyword: ElseDirectiveKeywordToken = undefined!;
    members: ParseContextElementSequence<ElseDirective['kind']> = undefined!;

    get lastToken() {
        if (this.members.length !== 0) {
            const lastMember = this.members[this.members.length - 1];
            if (isNode(lastMember)) {
                return lastMember.lastToken;
            }

            return lastMember;
        }

        return this.elseDirectiveKeyword;
    }
}