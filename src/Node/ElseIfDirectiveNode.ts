import { MissingToken } from '../MissingToken';
import { Token } from '../Token';
import { Expression } from './Expression/Expression';
import { Node } from './Node';

export class ElseIfDirectiveNode extends Node {
    static CHILD_NAMES: (keyof ElseIfDirectiveNode)[] = [
        'elseIfDirectiveKeyword',
        'expression',
        'members',
    ];

    elseIfDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
    members: Array<Node | Token> = [];
}
