import { PreprocessorParseContextElementArray } from '../../PreprocessorParser';
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
    children: PreprocessorParseContextElementArray<RemDirective['kind']>;
    endDirective: EndDirective;
}
