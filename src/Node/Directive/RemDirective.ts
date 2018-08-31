import { ParseContextElementArray } from '../../ParserBase';
import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';
import { EndDirective } from './EndDirective';

export class RemDirective extends Directive {
    static CHILD_NAMES: (keyof RemDirective)[] = [
        'remDirectiveKeyword',
        'children',
        'endDirective',
    ];

    readonly kind = NodeKind.RemDirective;

    remDirectiveKeyword: Token;
    children: ParseContextElementArray<RemDirective['kind']>;
    endDirective: EndDirective;
}
