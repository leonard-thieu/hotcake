import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { EndDirectiveKeywordToken, IfDirectiveKeywordToken, NumberSignToken, RemDirectiveKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class RemDirective extends Directive {
    readonly kind = NodeKind.RemDirective;

    remDirectiveKeyword: RemDirectiveKeywordToken = undefined!;
    children: ParseContextElementArray<RemDirective['kind']> = undefined!;
    endDirectiveNumberSign: MissableToken<NumberSignToken> = undefined!;
    endDirectiveKeyword: MissableToken<EndDirectiveKeywordToken> = undefined!;
    endIfDirectiveKeyword?: IfDirectiveKeywordToken = undefined;
}
