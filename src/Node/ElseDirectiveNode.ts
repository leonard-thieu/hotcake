import { Token } from '../Token';
import { DirectiveNode } from './DirectiveNode';
import { Node } from './Node';

export class ElseDirectiveNode extends DirectiveNode {
    static CHILD_NAMES: (keyof ElseDirectiveNode)[] = [
        'numberSign',
        'elseDirectiveKeyword',
        'members',
    ];

    elseDirectiveKeyword: Token | null = null;
    members: Array<Node | Token> = [];
}
