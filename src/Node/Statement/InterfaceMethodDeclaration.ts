import { Token } from "../../Token";
import { DataDeclarationList } from "../DataDeclarationList";
import { NodeKind } from "../NodeKind";
import { QualifiedIdentifier } from "../QualifiedIdentifier";
import { Statement } from "./Statement";

export class InterfaceMethodDeclaration extends Statement {
    static CHILD_NAMES: (keyof InterfaceMethodDeclaration)[] = [
        'methodKeyword',
        'name',
        'colon',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.InterfaceMethodDeclaration;

    methodKeyword: Token;
    name: Token;
    colon: Token | null = null;
    returnType: QualifiedIdentifier | null = null;
    openingParenthesis: Token;
    parameters: DataDeclarationList;
    closingParenthesis: Token;
}
