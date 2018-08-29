import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Declaration } from "./Declaration";

export class ModuleDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ModuleDeclaration)[] = [
        'members',
    ];

    filePath: string;
    document: string;

    readonly kind = NodeKind.ModuleDeclaration;

    members: Array<Declaration | Token>;
}
