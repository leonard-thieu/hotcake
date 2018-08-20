import { Token } from './Token';
import { MissingToken } from './MissingToken';

export abstract class Node {
    parent: Node | null = null;
    children: Array<Token | Node> = [];

    toJSON() {
        return {
            [this.constructor.name]: {
                ...this.toJSONBeforeChildren(),
                children: this.children,
                ...this.toJSONAfterChildren(),
            },
        };
    }

    protected toJSONBeforeChildren(): any {
        return null;
    }

    protected toJSONAfterChildren(): any {
        return null;
    }
}

export class ModuleNode extends Node {
    eofToken: Token | null = null;

    protected toJSONAfterChildren() {
        return {
            eofToken: this.eofToken,
        };
    }
}

export class IfDirectiveNode extends Node {
    ifDirectiveKeyword: Token | null = null;
    expression: Node | MissingToken | null = null;
    elseIfDirectives: ElseIfDirectiveNode[] = [];
    elseDirective: ElseDirectiveNode | null = null;
    endDirectiveKeyword: Token | MissingToken | null = null;

    protected toJSONBeforeChildren() {
        return {
            ifDirectiveKeyword: this.ifDirectiveKeyword,
            expression: this.expression,
        };
    }

    protected toJSONAfterChildren() {
        return {
            elseIfDirectives: this.elseIfDirectives,
            elseDirective: this.elseDirective,
            endDirectiveKeyword: this.endDirectiveKeyword,
        };
    }
}

export class ElseIfDirectiveNode extends Node {
    elseIfDirectiveKeyword: Token | null = null;
    expression: Node | MissingToken | null = null;

    protected toJSONBeforeChildren() {
        return {
            elseIfDirectiveKeyword: this.elseIfDirectiveKeyword,
            expression: this.expression,
        };
    }
}

export class ElseDirectiveNode extends Node {
    elseDirectiveKeyword: Token | null = null;

    protected toJSONBeforeChildren() {
        return {
            elseDirectiveKeyword: this.elseDirectiveKeyword,
        };
    }
}

export class RemDirectiveNode extends Node {
    remDirectiveKeyword: Token | null = null;
    endDirectiveKeyword: Token | MissingToken | null = null;

    protected toJSONBeforeChildren() {
        return {
            remDirectiveKeyword: this.remDirectiveKeyword,
        };
    }

    protected toJSONAfterChildren() {
        return {
            endDirectiveKeyword: this.endDirectiveKeyword,
        };
    }
}

export class PrintDirectiveNode extends Node {
    printDirectiveKeyword: Token | null = null;
    expression: Node | MissingToken | null = null;

    protected toJSONBeforeChildren() {
        return {
            printDirectiveKeyword: this.printDirectiveKeyword,
            expression: this.expression,
        };
    }
}

export class ErrorDirectiveNode extends Node {
    errorDirectiveKeyword: Token | null = null;
    expression: Node | MissingToken | null = null;

    protected toJSONBeforeChildren() {
        return {
            errorDirectiveKeyword: this.errorDirectiveKeyword,
            expression: this.expression,
        };
    }
}