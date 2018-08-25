import { MissingToken } from '../../MissingToken';
import { Token } from '../../Token';
import { Expression } from '../Expression/Expression';
import { Directive } from './Directive';
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

    ifDirectiveKeyword: Token;
    expression: Expression | MissingToken;
    members: Array<Directive | Token> = [];
    elseIfDirectives: ElseIfDirective[] = [];
    elseDirective: ElseDirective | null = null;
    endDirective: EndDirective;
}
