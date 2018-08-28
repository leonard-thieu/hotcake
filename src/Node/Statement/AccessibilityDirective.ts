import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Statement } from "./Statement";

export class AccessibilityDirective extends Statement {
    static CHILD_NAMES: (keyof AccessibilityDirective)[] = [
        'accessibilityKeyword',
        'externPrivateKeyword',
    ];

    readonly kind = NodeKind.AccessibilityDirective;

    accessibilityKeyword: Token;
    externPrivateKeyword: Token | null;
}
