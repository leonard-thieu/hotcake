import { MissingToken } from '../MissingToken';
import { Token } from '../Token';
import { DirectiveNode } from './DirectiveNode';
import { Expression } from './Expression/Expression';
import { Node } from './Node';

export class ElseIfDirectiveNode extends DirectiveNode {
    static CHILD_NAMES: (keyof ElseIfDirectiveNode)[] = [
        'numberSign',
        'elseIfDirectiveKeyword',
        'expression',
        'members',
    ];

    elseIfDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
    members: Array<Node | Token> = [];
}
