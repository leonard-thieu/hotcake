import { MissingToken } from '../../MissingToken';
import { Token } from '../../Token';
import { Expression } from '../Expression/Expression';
import { Directive } from './Directive';

export class ElseIfDirective extends Directive {
    static CHILD_NAMES: (keyof ElseIfDirective)[] = [
        'numberSign',
        'elseIfDirectiveKeyword',
        'expression',
        'members',
    ];

    elseIfDirectiveKeyword: Token;
    expression: Expression | MissingToken;
    members: Array<Directive | Token> = [];
}
