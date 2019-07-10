import { ExternKeywordToken, PrivateKeywordToken, ProtectedKeywordToken, PublicKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class AccessibilityDirective extends Declaration {
    static CHILD_NAMES: (keyof AccessibilityDirective)[] = [
        'accessibilityKeyword',
        'externPrivateKeyword',
    ];

    readonly kind = NodeKind.AccessibilityDirective;

    accessibilityKeyword: AccessibilityKeywordToken = undefined!;
    externPrivateKeyword?: PrivateKeywordToken = undefined;

    get firstToken() {
        return this.accessibilityKeyword;
    }

    get lastToken() {
        if (this.externPrivateKeyword) {
            return this.externPrivateKeyword;
        }

        return this.accessibilityKeyword;
    }
}

export type AccessibilityKeywordToken =
    PrivateKeywordToken |
    PublicKeywordToken |
    ProtectedKeywordToken |
    ExternKeywordToken
    ;
