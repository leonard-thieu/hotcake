import { MissingToken } from '../../MissingToken';
import { Token } from '../../Token';
import { Expressions } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive, Directives } from './Directive';
import { ElseDirective } from './ElseDirective';
import { ElseIfDirective } from './ElseIfDirective';
import { EndDirective } from './EndDirective';

export class IfDirective extends Directive {
    static CHILD_NAMES: (keyof IfDirective)[] = [
        'numberSign',
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
    members: Array<Directives | Token> = [];
    elseIfDirectives: ElseIfDirective[] = [];
    elseDirective: ElseDirective | null = null;
    endDirective: EndDirective;
}
