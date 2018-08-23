import { MissingToken } from '../MissingToken';
import { Token } from '../Token';
import { DirectiveNode } from './DirectiveNode';
import { ElseDirectiveNode } from './ElseDirectiveNode';
import { ElseIfDirectiveNode } from './ElseIfDirectiveNode';
import { EndDirectiveNode } from './EndDirectiveNode';
import { Expression } from './Expression/Expression';
import { Node } from './Node';

export class IfDirectiveNode extends DirectiveNode {
    static CHILD_NAMES: (keyof IfDirectiveNode)[] = [
        'numberSign',
        'ifDirectiveKeyword',
        'expression',
        'members',
        'elseIfDirectives',
        'elseDirective',
        'endDirective',
    ];

    ifDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
    members: Array<Node | Token> = [];
    elseIfDirectives: ElseIfDirectiveNode[] = [];
    elseDirective: ElseDirectiveNode | null = null;
    endDirective: EndDirectiveNode | null = null;
}
