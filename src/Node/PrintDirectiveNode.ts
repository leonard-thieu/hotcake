import { MissingToken } from '../MissingToken';
import { Token } from '../Token';
import { Expression } from './Expression/Expression';
import { Node } from './Node';

export class PrintDirectiveNode extends Node {
    static CHILD_NAMES: (keyof PrintDirectiveNode)[] = [
        'printDirectiveKeyword',
        'expression',
    ];

    printDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
}
