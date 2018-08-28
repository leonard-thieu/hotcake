import { Token } from "../../Token";
import { Node } from "../Node";
import { NodeKind } from "../NodeKind";
import { Statement } from "./Statement";

export class ClassDeclaration extends Statement {
    static CHILD_NAMES: (keyof ClassDeclaration)[] = [
        'classKeyword',
        'name',
        'members',
        'endKeyword',
        'endClassKeyword',
    ];

    readonly kind = NodeKind.ClassDeclaration;

    classKeyword: Token;
    name: Token;
    members: Array<Node | Token>;
    endKeyword: Token;
    endClassKeyword: Token | null = null;
}
