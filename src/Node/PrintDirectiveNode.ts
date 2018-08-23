import { MissingToken } from '../MissingToken';
import { Token } from '../Token';
import { DirectiveNode } from './DirectiveNode';
import { Expression } from './Expression/Expression';

export class PrintDirectiveNode extends DirectiveNode {
    static CHILD_NAMES: (keyof PrintDirectiveNode)[] = [
        'numberSign',
        'printDirectiveKeyword',
        'expression',
    ];

    printDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
}
