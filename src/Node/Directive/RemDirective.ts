import { ParseContextElementArray } from '../../ParserBase';
import { RemDirectiveKeywordToken } from '../../Token/Token';
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

    remDirectiveKeyword: RemDirectiveKeywordToken;
    children: ParseContextElementArray<RemDirective['kind']>;
    endDirective: EndDirective;
}
