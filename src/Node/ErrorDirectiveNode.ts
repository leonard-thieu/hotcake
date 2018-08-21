import { MissingToken } from '../MissingToken';
import { Token } from '../Token';
import { Expression } from './Expression/Expression';
import { Node } from './Node';

export class ErrorDirectiveNode extends Node {
    static CHILD_NAMES: (keyof ErrorDirectiveNode)[] = [
        'errorDirectiveKeyword',
        'expression',
    ];

    errorDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
}
