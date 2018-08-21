import { Token } from '../Token';
import { Node } from './Node';

export class ElseDirectiveNode extends Node {
    static CHILD_NAMES: (keyof ElseDirectiveNode)[] = [
        'elseDirectiveKeyword',
        'members',
    ];

    elseDirectiveKeyword: Token | null = null;
    members: Array<Node | Token> = [];
}
