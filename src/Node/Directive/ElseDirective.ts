import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Directive, Directives } from './Directive';

export class ElseDirective extends Directive {
    static CHILD_NAMES: (keyof ElseDirective)[] = [
        'elseDirectiveKeyword',
        'members',
    ];

    readonly kind = NodeKind.ElseDirective;

    elseDirectiveKeyword: Token;
    members: Array<Directives | Token> = [];
}
