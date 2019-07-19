import { MissableToken } from '../../Token/MissingToken';
import { ElseDirectiveKeywordToken, ElseIfDirectiveKeywordToken, EndDirectiveKeywordToken, IfDirectiveKeywordToken, NumberSignToken, Tokens } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive, Directives } from './Directive';

export const IfDirectiveChildNames: ReadonlyArray<keyof IfDirective> = [
    'numberSign',
    'ifDirectiveKeyword',
    'expression',
    'members',
    'elseIfDirectives',
    'elseDirective',
    'endDirectiveNumberSign',
    'endDirectiveKeyword',
    'endIfDirectiveKeyword',
];

export class IfDirective extends Directive {
    readonly kind = NodeKind.IfDirective;

    ifDirectiveKeyword: IfDirectiveKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
    members: (Directives | Tokens)[] = undefined!;
    elseIfDirectives: ElseIfDirective[] = undefined!;
    elseDirective?: ElseDirective = undefined;
    endDirectiveNumberSign: MissableToken<NumberSignToken> = undefined!;
    endDirectiveKeyword: MissableToken<EndDirectiveKeywordToken> = undefined!;
    endIfDirectiveKeyword?: IfDirectiveKeywordToken = undefined;
}

export const ElseIfDirectiveChildNames: ReadonlyArray<keyof ElseIfDirective> = [
    'numberSign',
    'elseIfDirectiveKeyword',
    'ifDirectiveKeyword',
    'expression',
    'members',
];

export class ElseIfDirective extends Directive {
    readonly kind = NodeKind.ElseIfDirective;

    elseIfDirectiveKeyword: ElseIfDirectiveKeywordToken | ElseDirectiveKeywordToken = undefined!;
    ifDirectiveKeyword?: IfDirectiveKeywordToken = undefined;
    expression: MissableExpression = undefined!;
    members: (Directives | Tokens)[] = undefined!;
}

export const ElseDirectiveChildNames: ReadonlyArray<keyof ElseDirective> = [
    'numberSign',
    'elseDirectiveKeyword',
    'members',
];

export class ElseDirective extends Directive {
    readonly kind = NodeKind.ElseDirective;

    elseDirectiveKeyword: ElseDirectiveKeywordToken = undefined!;
    members: (Directives | Tokens)[] = undefined!;
}
