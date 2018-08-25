import { Token } from '../../Token';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class ElseDirective extends Directive {
    static CHILD_NAMES: (keyof ElseDirective)[] = [
        'numberSign',
        'elseDirectiveKeyword',
        'members',
    ];

    readonly kind = NodeKind.ElseDirective;

    elseDirectiveKeyword: Token;
    members: Array<Directive | Token> = [];
}
