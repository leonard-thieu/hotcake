import { ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ElseDirectiveKeywordToken, ElseIfDirectiveKeywordToken, EndDirectiveKeywordToken, IfDirectiveKeywordToken, NumberSignToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
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

    ifDirectiveKeyword: IfDirectiveKeywordToken;
    expression: MissableExpression;
    members: ParseContextElementSequence<IfDirective['kind']>;
    elseIfDirectives: ParseContextElementSequence<ParseContextKind.ElseIfDirectiveList>;
    elseDirective: ElseDirective | null = null;
    endDirectiveNumberSign: MissableToken<NumberSignToken>;
    endDirectiveKeyword: MissableToken<EndDirectiveKeywordToken>;
    endIfDirectiveKeyword: IfDirectiveKeywordToken | null = null;
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

    elseIfDirectiveKeyword: ElseIfDirectiveKeywordToken | ElseDirectiveKeywordToken;
    ifDirectiveKeyword: IfDirectiveKeywordToken | null = null;
    expression: MissableExpression;
    members: ParseContextElementSequence<ElseIfDirective['kind']>;
}

export class ElseDirective extends Directive {
    static CHILD_NAMES: (keyof ElseDirective)[] = [
        'numberSign',
        'elseDirectiveKeyword',
        'members',
    ];

    readonly kind = NodeKind.ElseDirective;

    elseDirectiveKeyword: ElseDirectiveKeywordToken;
    members: ParseContextElementSequence<ElseDirective['kind']>;
}
