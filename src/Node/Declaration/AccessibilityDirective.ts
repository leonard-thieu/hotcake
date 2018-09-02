import { ExternKeywordToken, PrivateKeywordToken, ProtectedKeywordToken, PublicKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class AccessibilityDirective extends Declaration {
    static CHILD_NAMES: (keyof AccessibilityDirective)[] = [
        'accessibilityKeyword',
        'externPrivateKeyword',
    ];

    readonly kind = NodeKind.AccessibilityDirective;

    accessibilityKeyword: PrivateKeywordToken | PublicKeywordToken | ProtectedKeywordToken | ExternKeywordToken;
    externPrivateKeyword: PrivateKeywordToken | null = null;
}
