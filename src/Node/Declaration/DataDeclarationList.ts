import { ParseContextElementArray } from "../../Parser";
import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Declaration } from "./Declaration";

export class DataDeclarationList extends Declaration {
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
    children: ParseContextElementArray<DataDeclarationList['kind']>;
}
