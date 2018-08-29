import { Token } from "../Token";
import { CommaSeparator } from "./CommaSeparator";
import { DataDeclaration } from "./DataDeclaration";
import { Node } from "./Node";
import { NodeKind } from "./NodeKind";

export class DataDeclarationList extends Node {
    static CHILD_NAMES: (keyof DataDeclarationList)[] = [
        'dataDeclarationKeyword',
        'children',
    ];

    readonly kind = NodeKind.DataDeclarationList;

    /**
     * Const, Global, Field, or Local
     * null for parameters
     */
    dataDeclarationKeyword: Token | null = null;
    children: Array<DataDeclaration | CommaSeparator>;
}
