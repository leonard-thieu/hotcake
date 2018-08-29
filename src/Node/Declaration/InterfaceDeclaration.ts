import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { QualifiedIdentifier } from "../QualifiedIdentifier";
import { Declaration } from "./Declaration";

export class InterfaceDeclaration extends Declaration {
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
    members: Array<Declaration | Token>;
    endKeyword: Token;
    endInterfaceKeyword: Token | null = null;
}
