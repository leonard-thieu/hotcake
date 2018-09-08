import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { EndDirectiveKeywordToken, IfDirectiveKeywordToken, NumberSignToken, RemDirectiveKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class RemDirective extends Directive {
    static CHILD_NAMES: (keyof RemDirective)[] = [
        'numberSign',
        'remDirectiveKeyword',
        'children',
        'endDirectiveNumberSign',
        'endDirectiveKeyword',
        'endIfDirectiveKeyword',
    ];

    readonly kind = NodeKind.RemDirective;

    remDirectiveKeyword: RemDirectiveKeywordToken;
    children: ParseContextElementArray<RemDirective['kind']>;
    endDirectiveNumberSign: MissableToken<NumberSignToken>;
    endDirectiveKeyword: MissableToken<EndDirectiveKeywordToken>;
    endIfDirectiveKeyword: IfDirectiveKeywordToken | null = null;
}
