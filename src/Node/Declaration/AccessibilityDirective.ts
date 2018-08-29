import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Declaration } from "./Declaration";

export class AccessibilityDirective extends Declaration {
    static CHILD_NAMES: (keyof AccessibilityDirective)[] = [
        'accessibilityKeyword',
        'externPrivateKeyword',
    ];

    readonly kind = NodeKind.AccessibilityDirective;

    accessibilityKeyword: Token;
    externPrivateKeyword: Token | null = null;
}
