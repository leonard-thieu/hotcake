import { MissingToken } from '../../MissingToken';
import { Token } from '../../Token';
import { Expression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class ElseIfDirective extends Directive {
    static CHILD_NAMES: (keyof ElseIfDirective)[] = [
        'numberSign',
        'elseIfDirectiveKeyword',
        'expression',
        'members',
    ];

    readonly kind = NodeKind.ElseIfDirective;

    elseIfDirectiveKeyword: Token;
    expression: Expression | MissingToken;
    members: Array<Directive | Token> = [];
}
