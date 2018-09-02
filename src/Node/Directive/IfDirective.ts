import { ParseContextElementArray } from '../../ParserBase';
import { MissingToken } from '../../Token/MissingToken';
import { ElseDirectiveKeywordToken, ElseIfDirectiveKeywordToken, IfDirectiveKeywordToken } from '../../Token/Token';
import { Expressions } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';
import { EndDirective } from './EndDirective';

export class IfDirective extends Directive {
    static CHILD_NAMES: (keyof IfDirective)[] = [
        'ifDirectiveKeyword',
        'expression',
        'members',
        'elseIfDirectives',
        'elseDirective',
        'endDirective',
    ];

    readonly kind = NodeKind.IfDirective;

    ifDirectiveKeyword: IfDirectiveKeywordToken;
    expression: Expressions | MissingToken;
    members: ParseContextElementArray<IfDirective['kind']>;
    elseIfDirectives: ElseIfDirective[] = [];
    elseDirective: ElseDirective | null = null;
    endDirective: EndDirective;
}

export class ElseIfDirective extends Directive {
    static CHILD_NAMES: (keyof ElseIfDirective)[] = [
        'elseIfDirectiveKeyword',
        'expression',
        'members',
    ];

    readonly kind = NodeKind.ElseIfDirective;

    elseIfDirectiveKeyword: ElseIfDirectiveKeywordToken;
    expression: Expressions | MissingToken;
    members: ParseContextElementArray<ElseIfDirective['kind']>;
}

export class ElseDirective extends Directive {
    static CHILD_NAMES: (keyof ElseDirective)[] = [
        'elseDirectiveKeyword',
        'members',
    ];

    readonly kind = NodeKind.ElseDirective;

    elseDirectiveKeyword: ElseDirectiveKeywordToken;
    members: ParseContextElementArray<ElseDirective['kind']>;
}
