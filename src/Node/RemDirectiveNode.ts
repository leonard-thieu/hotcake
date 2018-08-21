import { MissingToken } from '../MissingToken';
import { Token } from '../Token';
import { IfDirectiveNode } from './IfDirectiveNode';
import { Node } from './Node';

export class RemDirectiveNode extends Node {
    static CHILD_NAMES: (keyof RemDirectiveNode)[] = [
        'remDirectiveKeyword',
        'children',
        'endDirectiveKeyword',
    ];

    remDirectiveKeyword: Token | null = null;
    children: Array<RemDirectiveNode | IfDirectiveNode | Token> = [];
    endDirectiveKeyword: Token | MissingToken | null = null;
}
