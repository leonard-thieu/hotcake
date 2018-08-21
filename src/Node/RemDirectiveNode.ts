import { MissingToken } from '../MissingToken';
import { Token } from '../Token';
import { Node } from './Node';

export class RemDirectiveNode extends Node {
    static CHILD_NAMES: (keyof RemDirectiveNode)[] = [
        'remDirectiveKeyword',
        'children',
        'endDirectiveKeyword',
    ];

    remDirectiveKeyword: Token | null = null;
    children: Array<Node | Token> = [];
    endDirectiveKeyword: Token | MissingToken | null = null;
}
