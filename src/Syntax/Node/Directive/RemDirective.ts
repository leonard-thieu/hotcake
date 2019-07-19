import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { EndDirectiveKeywordToken, IfDirectiveKeywordToken, NumberSignToken, RemDirectiveBodyToken, RemDirectiveKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';
import { IfDirective } from './IfDirective';

export const RemDirectiveChildNames: ReadonlyArray<keyof RemDirective> = [
    'numberSign',
    'remDirectiveKeyword',
    'children',
    'endDirectiveNumberSign',
    'endDirectiveKeyword',
    'endIfDirectiveKeyword',
];

export class RemDirective extends Directive {
    readonly kind = NodeKind.RemDirective;

    remDirectiveKeyword: RemDirectiveKeywordToken = undefined!;
    children: (RemDirectiveChild | SkippedToken)[] = undefined!;
    endDirectiveNumberSign: MissableToken<NumberSignToken> = undefined!;
    endDirectiveKeyword: MissableToken<EndDirectiveKeywordToken> = undefined!;
    endIfDirectiveKeyword?: IfDirectiveKeywordToken = undefined;
}

export type RemDirectiveChild =
    | IfDirective
    | RemDirective
    | RemDirectiveBodyToken
    ;
