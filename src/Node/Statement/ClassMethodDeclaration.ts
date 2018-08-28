import { Token } from "../../Token";
import { DataDeclarationList } from "../DataDeclarationList";
import { NodeKind } from "../NodeKind";
import { QualifiedIdentifier } from "../QualifiedIdentifier";
import { Statement } from "./Statement";

export class ClassMethodDeclaration extends Statement {
    static CHILD_NAMES: (keyof ClassMethodDeclaration)[] = [
        'methodKeyword',
        'name',
        'colon',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
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
    statements: Array<Statement | Token>;
    endKeyword: Token;
    endMethodKeyword: Token | null = null;
}
