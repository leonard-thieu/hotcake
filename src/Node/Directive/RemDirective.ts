import { Token } from '../../Token';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';
import { EndDirective } from './EndDirective';
import { IfDirective } from './IfDirective';

export class RemDirective extends Directive {
    static CHILD_NAMES: (keyof RemDirective)[] = [
        'remDirectiveKeyword',
        'children',
        'endDirective',
    ];

    readonly kind = NodeKind.RemDirective;

    remDirectiveKeyword: Token;
    children: Array<RemDirective | IfDirective | Token> = [];
    endDirective: EndDirective;
}
