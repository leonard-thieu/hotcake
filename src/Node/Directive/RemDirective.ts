import { Token } from '../../Token';
import { Directive } from './Directive';
import { EndDirective } from './EndDirective';
import { IfDirective } from './IfDirective';

export class RemDirective extends Directive {
    static CHILD_NAMES: (keyof RemDirective)[] = [
        'numberSign',
        'remDirectiveKeyword',
        'children',
        'endDirective',
    ];

    remDirectiveKeyword: Token;
    children: Array<RemDirective | IfDirective | Token> = [];
    endDirective: EndDirective;
}
