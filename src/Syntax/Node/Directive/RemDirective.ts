import { MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { EndDirectiveKeywordToken, IfDirectiveKeywordToken, NumberSignToken, RemDirectiveBodyToken, RemDirectiveKeywordToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Directive } from './Directives';
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
    endDirectiveNumberSign: NumberSignToken | MissingToken = undefined!;
    endDirectiveKeyword: EndDirectiveKeywordToken | MissingToken = undefined!;
    endIfDirectiveKeyword?: IfDirectiveKeywordToken = undefined!;
}

export type RemDirectiveChild =
    | IfDirective
    | RemDirective
    | RemDirectiveBodyToken
    ;
