import { ParseContextElementArray } from "../../Parser";
import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { QualifiedIdentifier } from "../QualifiedIdentifier";
import { DataDeclarationList } from "./DataDeclarationList";
import { Declaration } from "./Declaration";

export class ClassMethodDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ClassMethodDeclaration)[] = [
        'methodKeyword',
        'name',
        'colon',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
        'attributes',
        'statements',
        'endKeyword',
        'endMethodKeyword',
    ];

    readonly kind = NodeKind.ClassMethodDeclaration;

    methodKeyword: Token;
    name: Token;
    colon: Token | null = null;
    returnType: QualifiedIdentifier | null = null;
    openingParenthesis: Token;
    parameters: DataDeclarationList;
    closingParenthesis: Token;
    attributes: Token[] = [];
    statements: ParseContextElementArray<ClassMethodDeclaration['kind']> | null = null;
    endKeyword: Token | null = null;
    endMethodKeyword: Token | null = null;
}
