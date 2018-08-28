import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { QualifiedIdentifier } from "../QualifiedIdentifier";
import { Statement } from "./Statement";

export class AliasDirective extends Statement {
    static CHILD_NAMES: (keyof AliasDirective)[] = [
        'aliasKeyword',
        'name',
        'equalsSign',
        'target',
    ];

    readonly kind = NodeKind.AliasDirective;

    aliasKeyword: Token;
    name: Token;
    equalsSign: Token;
    target: QualifiedIdentifier;
}
