import { PreprocessorToken } from "./PreprocessorToken";

export abstract class Node {
    parent: Node | null = null;
    children: Array<PreprocessorToken | Node> = [];
}

export class ModuleNode extends Node {
    eofToken: PreprocessorToken | null = null;
}