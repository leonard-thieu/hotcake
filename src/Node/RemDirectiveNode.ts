import { Token } from '../Token';
import { DirectiveNode } from './DirectiveNode';
import { EndDirectiveNode } from './EndDirectiveNode';
import { IfDirectiveNode } from './IfDirectiveNode';

export class RemDirectiveNode extends DirectiveNode {
    static CHILD_NAMES: (keyof RemDirectiveNode)[] = [
        'numberSign',
        'remDirectiveKeyword',
        'children',
        'endDirective',
    ];

    remDirectiveKeyword: Token | null = null;
    children: Array<RemDirectiveNode | IfDirectiveNode | Token> = [];
    endDirective: EndDirectiveNode | null = null;
}
