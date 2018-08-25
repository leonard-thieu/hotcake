import { MissingToken } from '../../MissingToken';
import { Token } from '../../Token';
import { Expressions } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive, Directives } from './Directive';

export class ElseIfDirective extends Directive {
    static CHILD_NAMES: (keyof ElseIfDirective)[] = [
        'numberSign',
        'elseIfDirectiveKeyword',
        'expression',
        'members',
    ];

    readonly kind = NodeKind.ElseIfDirective;

    elseIfDirectiveKeyword: Token;
    expression: Expressions | MissingToken;
    members: Array<Directives | Token> = [];
}
