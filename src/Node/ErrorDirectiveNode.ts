import { MissingToken } from '../MissingToken';
import { Token } from '../Token';
import { DirectiveNode } from './DirectiveNode';
import { Expression } from './Expression/Expression';

export class ErrorDirectiveNode extends DirectiveNode {
    static CHILD_NAMES: (keyof ErrorDirectiveNode)[] = [
        'numberSign',
        'errorDirectiveKeyword',
        'expression',
    ];

    errorDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
}
