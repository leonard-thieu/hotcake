import { ParseContextElementArray } from "../../Parser";
import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { QualifiedIdentifier } from "../QualifiedIdentifier";
import { DataDeclarationList } from "./DataDeclarationList";
import { Declaration } from "./Declaration";

export class FunctionDeclaration extends Declaration {
    static CHILD_NAMES: (keyof FunctionDeclaration)[] = [
        'functionKeyword',
        'name',
        'colon',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
        'statements',
        'endKeyword',
        'endFunctionKeyword',
    ];

    readonly kind = NodeKind.FunctionDeclaration;

    functionKeyword: Token;
    name: Token;
    colon: Token | null = null;
    returnType: QualifiedIdentifier | null = null;
    openingParenthesis: Token;
    parameters: DataDeclarationList;
    closingParenthesis: Token;
    statements: ParseContextElementArray<FunctionDeclaration['kind']>;
    endKeyword: Token;
    endFunctionKeyword: Token | null = null;
}
