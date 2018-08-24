import { Token } from '../../Token';
import { Directive } from './Directive';

export class ElseDirective extends Directive {
    static CHILD_NAMES: (keyof ElseDirective)[] = [
        'numberSign',
        'elseDirectiveKeyword',
        'members',
    ];

    elseDirectiveKeyword: Token | null = null;
    members: Array<Directive | Token> = [];
}
