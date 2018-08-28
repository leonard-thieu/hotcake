import { Token } from "../Token";
import { Node } from "./Node";
import { NodeKind } from "./NodeKind";

export class Module extends Node {
    static CHILD_NAMES: (keyof Module)[] = [
        'members',
    ];

    filePath: string;
    document: string;

    readonly kind = NodeKind.Module;

    members: Array<Node | Token>;
}
