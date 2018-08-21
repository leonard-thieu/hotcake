import { Token } from './Token';
import { MissingToken } from './MissingToken';

export abstract class Node {
    parent: Node | null = null;

    toJSON() {
        const obj: any = {};

        for (const childName of this.getChildNames()) {
            obj[childName] = this[childName];
        }

        return {
            [this.constructor.name]: obj,
        };
    }

    private getChildNames<K extends keyof this>(): K[] {
        const ctor = this.constructor as any;

        return ctor.CHILD_NAMES || [];
    }
}

export class ModuleNode extends Node {
    static CHILD_NAMES: (keyof ModuleNode)[] = [
        'members',
        'eofToken',
    ];

    members: Array<Node | Token> = [];
    eofToken: Token | null = null;
}

export class IfDirectiveNode extends Node {
    static CHILD_NAMES: (keyof IfDirectiveNode)[] = [
        'ifDirectiveKeyword',
        'expression',
        'members',
        'elseIfDirectives',
        'elseDirective',
        'endDirectiveKeyword',
    ];

    ifDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
    members: Array<Node | Token> = [];
    elseIfDirectives: ElseIfDirectiveNode[] = [];
    elseDirective: ElseDirectiveNode | null = null;
    endDirectiveKeyword: Token | MissingToken | null = null;
}

export class ElseIfDirectiveNode extends Node {
    static CHILD_NAMES: (keyof ElseIfDirectiveNode)[] = [
        'elseIfDirectiveKeyword',
        'expression',
        'members',
    ];

    elseIfDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
    members: Array<Node | Token> = [];
}

export class ElseDirectiveNode extends Node {
    static CHILD_NAMES: (keyof ElseDirectiveNode)[] = [
        'elseDirectiveKeyword',
        'members',
    ];

    elseDirectiveKeyword: Token | null = null;
    members: Array<Node | Token> = [];
}

export class RemDirectiveNode extends Node {
    static CHILD_NAMES: (keyof RemDirectiveNode)[] = [
        'remDirectiveKeyword',
        'children',
        'endDirectiveKeyword',
    ];

    remDirectiveKeyword: Token | null = null;
    children: Array<Node | Token> = [];
    endDirectiveKeyword: Token | MissingToken | null = null;
}

export class PrintDirectiveNode extends Node {
    static CHILD_NAMES: (keyof PrintDirectiveNode)[] = [
        'printDirectiveKeyword',
        'expression',
    ];

    printDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
}

export class ErrorDirectiveNode extends Node {
    static CHILD_NAMES: (keyof ErrorDirectiveNode)[] = [
        'errorDirectiveKeyword',
        'expression',
    ];

    errorDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
}

export abstract class Expression extends Node { }

export class StringLiteral extends Expression {
    static CHILD_NAMES: (keyof StringLiteral)[] = [
        'startQuote',
        'children',
        'endQuote',
    ];

    startQuote: Token | null = null;
    children: Array<Token> = [];
    endQuote: Token | MissingToken | null = null;
}
