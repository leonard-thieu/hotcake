import { MissingToken } from '../MissingToken';
import { Token } from '../Token';
import { ElseDirectiveNode } from './ElseDirectiveNode';
import { ElseIfDirectiveNode } from './ElseIfDirectiveNode';
import { Expression } from './Expression/Expression';
import { Node } from './Node';

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
