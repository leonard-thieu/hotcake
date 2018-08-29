import { Token } from "../../Token";
import { Node } from "../Node";
import { NodeKind } from "../NodeKind";
import { QualifiedIdentifier } from "../QualifiedIdentifier";
import { Statement } from "./Statement";

export class InterfaceDeclaration extends Statement {
    static CHILD_NAMES: (keyof InterfaceDeclaration)[] = [
        'interfaceKeyword',
        'name',
        'extendsKeyword',
        'baseTypes',
        'members',
        'endKeyword',
        'endInterfaceKeyword',
    ];

    readonly kind = NodeKind.InterfaceDeclaration;

    interfaceKeyword: Token;
    name: Token;
    extendsKeyword: Token | null = null;
    baseTypes: Array<QualifiedIdentifier | Token> | null = null;
    members: Array<Node | Token>;
    endKeyword: Token;
    endInterfaceKeyword: Token | null = null;
}
