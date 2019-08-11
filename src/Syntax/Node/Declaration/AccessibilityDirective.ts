import { ExternKeywordToken, PrivateKeywordToken, ProtectedKeywordToken, PublicKeywordToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Declaration } from './Declarations';

export const AccessibilityDirectiveChildNames: ReadonlyArray<keyof AccessibilityDirective> = [
    'accessibilityKeyword',
    'externPrivateKeyword',
];

export class AccessibilityDirective extends Declaration {
    readonly kind = NodeKind.AccessibilityDirective;

    accessibilityKeyword: AccessibilityKeywordToken = undefined!;
    externPrivateKeyword?: PrivateKeywordToken = undefined;
}

export type AccessibilityKeywordToken =
    | PrivateKeywordToken
    | PublicKeywordToken
    | ProtectedKeywordToken
    | ExternKeywordToken
    ;
