import { ParseContextElementArray } from '../../ParserBase';
import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
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

    ifDirectiveKeyword: Token;
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

    elseIfDirectiveKeyword: Token;
    expression: Expressions | MissingToken;
    members: ParseContextElementArray<ElseIfDirective['kind']>;
}

export class ElseDirective extends Directive {
    static CHILD_NAMES: (keyof ElseDirective)[] = [
        'elseDirectiveKeyword',
        'members',
    ];

    readonly kind = NodeKind.ElseDirective;

    elseDirectiveKeyword: Token;
    members: ParseContextElementArray<ElseDirective['kind']>;
}
