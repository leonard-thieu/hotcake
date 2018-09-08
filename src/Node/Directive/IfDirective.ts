import { ParseContextElementArray } from '../../ParserBase';
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
    ];

    readonly kind = NodeKind.IfDirective;

    ifDirectiveKeyword: IfDirectiveKeywordToken;
    expression: MissableExpression;
    members: ParseContextElementArray<IfDirective['kind']>;
    elseIfDirectives: ElseIfDirective[] = [];
    elseDirective: ElseDirective | null = null;
    endDirectiveNumberSign: MissableToken<NumberSignToken>;
    endDirectiveKeyword: MissableToken<EndDirectiveKeywordToken>;
}

export class ElseIfDirective extends Directive {
    static CHILD_NAMES: (keyof ElseIfDirective)[] = [
        'numberSign',
        'elseIfDirectiveKeyword',
        'expression',
        'members',
    ];

    readonly kind = NodeKind.ElseIfDirective;

    elseIfDirectiveKeyword: ElseIfDirectiveKeywordToken;
    expression: MissableExpression;
    members: ParseContextElementArray<ElseIfDirective['kind']>;
}

export class ElseDirective extends Directive {
    static CHILD_NAMES: (keyof ElseDirective)[] = [
        'numberSign',
        'elseDirectiveKeyword',
        'members',
    ];

    readonly kind = NodeKind.ElseDirective;

    elseDirectiveKeyword: ElseDirectiveKeywordToken;
    members: ParseContextElementArray<ElseDirective['kind']>;
}
