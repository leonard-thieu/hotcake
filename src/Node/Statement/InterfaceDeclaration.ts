import { Token } from "../../Token";
import { Node } from "../Node";
import { NodeKind } from "../NodeKind";
import { Statement } from "./Statement";

export class InterfaceDeclaration extends Statement {
    static CHILD_NAMES: (keyof InterfaceDeclaration)[] = [
        'interfaceKeyword',
        'name',
        'members',
        'endKeyword',
        'endInterfaceKeyword',
    ];

    readonly kind = NodeKind.InterfaceDeclaration;

    interfaceKeyword: Token;
    name: Token;
    members: Array<Node | Token>;
    endKeyword: Token;
    endInterfaceKeyword: Token | null = null;
}
