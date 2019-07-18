import { ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ElseDirectiveKeywordToken, ElseIfDirectiveKeywordToken, EndDirectiveKeywordToken, IfDirectiveKeywordToken, NumberSignToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class IfDirective extends Directive {
    readonly kind = NodeKind.IfDirective;

    ifDirectiveKeyword: IfDirectiveKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
    members: ParseContextElementSequence<IfDirective['kind']> = undefined!;
    elseIfDirectives: ParseContextElementSequence<ParseContextKind.ElseIfDirectiveList> = undefined!;
    elseDirective?: ElseDirective = undefined;
    endDirectiveNumberSign: MissableToken<NumberSignToken> = undefined!;
    endDirectiveKeyword: MissableToken<EndDirectiveKeywordToken> = undefined!;
    endIfDirectiveKeyword?: IfDirectiveKeywordToken = undefined;
}

export class ElseIfDirective extends Directive {
    readonly kind = NodeKind.ElseIfDirective;

    elseIfDirectiveKeyword: ElseIfDirectiveKeywordToken | ElseDirectiveKeywordToken = undefined!;
    ifDirectiveKeyword?: IfDirectiveKeywordToken = undefined;
    expression: MissableExpression = undefined!;
    members: ParseContextElementSequence<ElseIfDirective['kind']> = undefined!;
}

export class ElseDirective extends Directive {
    readonly kind = NodeKind.ElseDirective;

    elseDirectiveKeyword: ElseDirectiveKeywordToken = undefined!;
    members: ParseContextElementSequence<ElseDirective['kind']> = undefined!;
}
