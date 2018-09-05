import { ParseContextElementArray } from '../../ParserBase';
import { EndDirectiveKeywordToken, RemDirectiveKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class RemDirective extends Directive {
    static CHILD_NAMES: (keyof RemDirective)[] = [
        'remDirectiveKeyword',
        'children',
        'endDirectiveKeyword',
    ];

    readonly kind = NodeKind.RemDirective;

    remDirectiveKeyword: RemDirectiveKeywordToken;
    children: ParseContextElementArray<RemDirective['kind']>;
    endDirectiveKeyword: EndDirectiveKeywordToken;
}
