import { Token } from './Token';
import { MissingToken } from './MissingToken';

export abstract class Node {
    parent: Node | null = null;
    children: Array<Token | Node> = [];
}

export class ModuleNode extends Node {
    eofToken: Token | null = null;
}

export class IfDirectiveNode extends Node {
    ifDirectiveKeyword: Token | null = null;
    expression: Node | MissingToken | null = null;
    elseIfDirectives: ElseIfDirectiveNode[] = [];
    elseDirective: ElseDirectiveNode | null = null;
    endDirectiveKeyword: Token | MissingToken | null = null;
}

export class ElseIfDirectiveNode extends Node {
    elseIfDirectiveKeyword: Token | null = null;
    expression: Node | MissingToken | null = null;
}

export class ElseDirectiveNode extends Node {
    elseDirectiveKeyword: Token | null = null;
}

export class RemDirectiveNode extends Node {
    remDirectiveKeyword: Token | null = null;
    endDirectiveKeyword: Token | MissingToken | null = null;
}

export class PrintDirectiveNode extends Node {
    printDirectiveKeyword: Token | null = null;
    expression: Node | MissingToken | null = null;
}

export class ErrorDirectiveNode extends Node {
    errorDirectiveKeyword: Token | null = null;
    expression: Node | MissingToken | null = null;
}